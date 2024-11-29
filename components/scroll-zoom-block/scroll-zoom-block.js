const template = document.createElement('template');
template.innerHTML = /*html*/`
	<div class="scroll-margin-container">
		<div class="content-scale-container">
			<slot></slot>
		</div>
	</div>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
	:host {
		display: block;
		contain: size;
		overflow: hidden;
		touch-action: none;
	}

	:host(:active) {
		cursor: move;
	}

	.scroll-margin-container {
		display: grid;
		place-content: center;
		inline-size: var(--inline-size, 100%);
		block-size: var(--block-size, 100%);
	}

	.content-scale-container {
		width: fit-content;
		height: fit-content;
		scale: var(--zoom-level, 1);
		transform-origin: center center;
	}
`);



const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		if (entry.borderBoxSize?.length > 0) {
			const section = entry.target.closest('scroll-zoom-block');
			const sectionStyles = window.getComputedStyle(section);
			const sectionInlineSize = Number(sectionStyles.getPropertyValue('inline-size').replace('px', ''));
			const sectionBlockSize = Number(sectionStyles.getPropertyValue('block-size').replace('px', ''));

			const borderBoxSize = entry.borderBoxSize[0];
			const contentInlineSize = borderBoxSize.inlineSize;
			const contentBlockSize = borderBoxSize.blockSize;

			section.dispatchEvent(new CustomEvent('resized-content', {
				detail: {
					sectionInlineSize,
					sectionBlockSize,
					contentInlineSize,
					contentBlockSize,
				}
			}));
		}
	}
});



export class ScrollZoomBlock extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.appendChild(template.content.cloneNode(true));
		this.shadow.adoptedStyleSheets = [sheet];
	}


	static log = true;


	get scrollMarginContainer() {
		return this.shadow.querySelector('.scroll-margin-container');
	}

	get contentScaleContainer() {
		return this.shadow.querySelector('.content-scale-container');
	}

	get slot() {
		return this.shadow.querySelector('slot');
	}


	static beforeInteractionEventType = 'before-interaction';
	static afterInteractionEventType = 'after-interaction';

	dispatchInteractionEvent(interaction, type) {
		if (!interaction) interaction = 'none';
		this.dispatchEvent(
			new CustomEvent(type, {
				bubbles: true,
				composed: true,
				detail: {
					interaction,
				}
			})
		);
	}


	/** Timestamp du dernier event `pointerup`. */
	lastPointerUpTime = 0;

	/** Compteur du nombre d'events `pointerup` depuis le dernier double-tap. */
	pointerUpsCount = 0;

	/** Le délai maximal entre deux events `pointerup` pour déclencher un double-tap. */
	maxDoubleTapDelay = 500; // ms

	/** Le nombre minimal de pixels dont l'event `pointermove` doit bouger par rapport à la position initiale. En-dessous, on ignore le `pointermove` (car sinon, l'imprécision avec un doigt déclenche l'événement). */
	minMoveThreshold = 10; // px

	/** Liste des pointeurs actuellement down avec leur event `pointerdown`. */
	currentPointerDownEvents = new Map();

	/** Liste des pointeurs actuellement en mouvement avec leur event `pointermove`. */
	currentPointerMoveEvents = new Map();

	/** Si l'event `pointermove` est en attente de la prochaine frame. */
	pointermoveDebounce = false;

	/** Associe à chaque pointeur un AbortController. */
	currentPointersAbortControllers = new Map();

	/** Timestamp du dernier event `wheel`. */
	lastWheelTime = 0;

	/** Si l'event `wheel` est en attente de la prochaine frame. */
	wheelDebounce = false;

	/** Timeout pour reset le compteur de `pointerup`. */
	pointerUpTimeout = -1;


	/**
	 * Quand le pointeur touche la section, on écoute les événements requis pour détecter :
	 * - le clic maintenu puis glissé (pour scroller la section)
	 * - le double clic (pour zoomer la section, ou dézoomer si clic droit souris)
	 * - le double clic maintenu puis glissé verticalement (pour zoomer la section si vers le bas, dézoomer si vers le haut)
	 * - le pinch (pour zoomer la section si écarté, dézoomer si rapproché)
	 */
	onPointerDown(downEvent) {
		this.setPointerCapture(downEvent.pointerId);
		this.currentPointerDownEvents.set(downEvent.pointerId, downEvent);

		const abortController = new AbortController();
		this.currentPointersAbortControllers.set(downEvent.pointerId, abortController);

		const pointerDownTime = Date.now();
		const startScrollPosition = {
			x: this.scrollLeft,
			y: this.scrollTop,
		};

		const isCandidateForDoubleTap = downEvent.pointerType === 'touch'
			&& this.currentPointerDownEvents.size === 1
			&& (pointerDownTime - this.lastPointerUpTime) < this.maxDoubleTapDelay;

		const onPointerMove = (moveEvent) => this.onPointerMove.bind(this)(moveEvent, downEvent, startScrollPosition, isCandidateForDoubleTap);
		const onPointerUp = (upEvent) => this.onPointerUp.bind(this)(upEvent, downEvent);
		const onPointerCancel = (cancelEvent) => this.onPointerCancel.bind(this)(cancelEvent, downEvent);

		const abortSignal = abortController.signal;
		this.addEventListener('pointermove', onPointerMove, { signal: abortSignal });
		this.addEventListener('pointerup', onPointerUp, { signal: abortSignal });
		this.addEventListener('pointercancel', onPointerCancel, { signal: abortSignal });
	}
	boundOnPointerDown = this.onPointerDown.bind(this);


	/**
	 * Quand le pointeur se déplace, on détermine si :
	 * - un seul pointeur est down, auquel cas :
	 *     - si on est après un double-tap, on dé/zoome si le mouvement est vertical
	 *     - sinon, on scrolle dans la section
	 * - deux points sont down, auquel cas :
	 *     - on lance un événement custom `pinch`
	 */
	onPointerMove(
		moveEvent,
		downEvent,
		startScrollPosition,
		isCandidateForDoubleTap,
	) {
		this.currentPointerMoveEvents.set(moveEvent.pointerId, moveEvent);

		if (this.pointermoveDebounce) return;
		this.pointermoveDebounce = true;

		let interaction = '';
		switch (this.currentPointerDownEvents.size) {
			case 1:
				if (isCandidateForDoubleTap) interaction = 'doubleTapScroll';
				else interaction = 'scroll';
				break;
			default:
				interaction = 'pinch';
		}

		this.dispatchInteractionEvent(interaction, ScrollZoomBlock.beforeInteractionEventType);

		switch (interaction) {
			// ✅ FAIT
			case 'scroll': {
				this.scrollTo({
					left: startScrollPosition.x - (moveEvent.clientX - downEvent.clientX),
					top: startScrollPosition.y - (moveEvent.clientY - downEvent.clientY),
					behavior: 'instant',
				});
				if (this.constructor.log) console.log('move', 'scroll', {
					left: startScrollPosition.x - (moveEvent.clientX - downEvent.clientX),
					top: startScrollPosition.y - (moveEvent.clientY - downEvent.clientY)
				});
			} break;

			// 🟧 À FAIRE
			case 'doubleTapScroll': {
				if (this.constructor.log) console.log('doubleTapScroll');
			} break;

			// 🟧 À FAIRE
			case 'pinch': {
				let clientXTotal = 0, clientYTotal = 0;
				for (const evt of this.currentPointerMoveEvents.values()) {
					clientXTotal += evt.clientX;
					clientYTotal += evt.clientY;
				}
				const pointersMiddle = {
					x: clientXTotal / this.currentPointerMoveEvents.size,
					y: clientYTotal / this.currentPointerMoveEvents.size
				};

				let radiusTotal = 0;
				for (const evt of this.currentPointerMoveEvents.values()) {
					radiusTotal += Math.sqrt(
						(evt.clientX - pointersMiddle.x) ** 2
						+ (evt.clientY - pointersMiddle.y) ** 2
					);
				}
				const averageRadius = radiusTotal / this.currentPointerMoveEvents.size;

				// TODO zoomLevel = averageRadius / startAverageRadius (calculé pareil avec les downEvents, dans le onpointerdown)
				// TODO scrollPosition = currentScrollPos + pointersMiddle - startPointersMiddle (calculé pareil avec les downEvents, dans le onpointerdown)

				if (this.constructor.log) console.log('pinch', pointersMiddle, averageRadius);
			} break;
		}

		this.dispatchInteractionEvent(interaction, ScrollZoomBlock.afterInteractionEventType);

		requestAnimationFrame(() => this.pointermoveDebounce = false);
	}


	/**
	 * Quand le pointeur quitte la page, on détermine si :
	 * - c'est le deuxième pointeur à quitter la page en moins de `this.maxDoubleTapDelay` alors qu'il n'y avait qu'un pointeur sur la page, auquel cas :
	 *     - on lance un événement custom `double-tap`
	 */
	onPointerUp(
		upEvent,
		downEvent,
	) {
		if (this.constructor.log) console.log('up', upEvent);
		this.pointerUpsCount++;
		clearTimeout(this.pointerUpTimeout);
		this.pointerUpTimeout = setTimeout(() => this.pointerUpsCount = 0, this.maxDoubleTapDelay);
		const now = Date.now();

		let interaction = '';
		if (this.pointerUpsCount === 2) {
			this.pointerUpsCount = 0
				interaction = 'doubleTap';
		}

		if (this.constructor.log) console.log(this.pointerUpsCount);

		this.dispatchInteractionEvent(interaction, ScrollZoomBlock.beforeInteractionEventType);

		switch (interaction) {
			// 🟧 À FAIRE
			case 'doubleTap': {
				if (this.constructor.log) console.log('doubleTap', upEvent.button === 2 ? 'dézoom' : 'zoom');
			} break;
		}

		this.lastPointerUpTime = now;

		this.dispatchInteractionEvent(interaction, ScrollZoomBlock.afterInteractionEventType);

		this.onPointerCancel(upEvent, downEvent);
	}


	/**
	 * Quand le pointeur est annulé, on retire les event listeners.
	 */
	onPointerCancel(
		cancelEvent,
		downEvent,
	) {
		if (this.constructor.log) console.log('cancel', cancelEvent);
		const abortController = this.currentPointersAbortControllers.get(cancelEvent.pointerId);
		if (abortController) {
			abortController.abort();
			this.currentPointersAbortControllers.delete(cancelEvent.pointerId);
		}
		this.currentPointerDownEvents.delete(downEvent.pointerId);
	}


	onWheel(event) {
		if (this.wheelDebounce) return;
		this.wheelDebounce = true;

		const interaction = 'wheelZoom';
		this.dispatchInteractionEvent(interaction, ScrollZoomBlock.beforeInteractionEventType);

		// ✅ FAIT
		const zoomRatio = 1 - .1 * Math.sign(event.deltaY);
		this.zoom(
			this.currentZoomLevel * zoomRatio,
			{ x: event.clientX, y: event.clientY },
			this.getBoundingClientRect(),
		);

		this.dispatchInteractionEvent(interaction, ScrollZoomBlock.afterInteractionEventType);

		requestAnimationFrame(() => this.wheelDebounce = false);
	}
	boundOnWheel = this.onWheel.bind(this);


	onDoubleTap(event) {

	}
	boundOnDoubleTap = this.onDoubleTap.bind(this);


	onContextMenu(event) {
		event.preventDefault();
	}
	boundOnContextMenu = this.onContextMenu.bind(this);


	disconnectAllTemporaryEventListeners() {
		for (const abortController of this.currentPointersAbortControllers.values()) {
			abortController.abort();
		}
		this.currentPointersAbortControllers.clear();
	}


	onSlotChange(event) {
		const slot = event.target;
		if (!slot) return;

		const assignedElements = slot.assignedElements();
		for (const element of assignedElements) {
			resizeObserver.observe(element);
		}
	}
	boundOnSlotChange = this.onSlotChange.bind(this);


	parseStartPosition(position) {
		switch (position) {
			case 'start':
			case 'end':
			case 'center':
				return position;
			default:
				return 'center';
		}
	}

	get startPosition() {
		const startPositionAttribute = this.getAttribute('start-position') ?? '';
		const parts = startPositionAttribute.split(' ').filter(v => v);

		let startPositionX, startPositionY;
		if (parts.length === 2) {
			startPositionX = this.parseStartPosition(parts[0]);
			startPositionY = this.parseStartPosition(parts[1]);
		}
		else {
			startPositionX = this.parseStartPosition(parts[0]);
			startPositionY = startPositionX;
		}

		if (this.constructor.log) console.log(startPositionX, startPositionY);

		return {
			x: startPositionX,
			y: startPositionY
		};
	}


	#scrollMargins = {
		inline: 0,
		block: 0,
	};

	#contentSize = {
		inline: 0,
		block: 0,
	}


	#resizeScrollMarginContainer(
		contentInlineSize,
		contentBlockSize,
		sectionInlineSize,
		sectionBlockSize,
	) {
		const marginInline = Math.max(0, sectionInlineSize - contentInlineSize);
		const marginBlock = Math.max(0, sectionBlockSize - contentBlockSize);

		if (this.constructor.log) console.log(sectionInlineSize, sectionBlockSize, contentInlineSize, contentBlockSize, marginInline, marginBlock);

		const scrollMarginContainer = this.scrollMarginContainer;
		scrollMarginContainer.style.setProperty('--inline-size', `${(contentInlineSize + 2 * marginInline).toFixed(2)}px`);
		scrollMarginContainer.style.setProperty('--block-size', `${(contentBlockSize + 2 * marginBlock).toFixed(2)}px`);

		this.#scrollMargins = {
			inline: marginInline,
			block: marginBlock,
		};
	}


	initializeScrollPosition(event) {
		const startPosition = this.startPosition;
		const { sectionInlineSize, sectionBlockSize, contentInlineSize, contentBlockSize } = event.detail;

		this.#contentSize = {
			inline: contentInlineSize,
			block: contentBlockSize,
		};

		this.#resizeScrollMarginContainer(
			contentInlineSize,
			contentBlockSize,
			sectionInlineSize,
			sectionBlockSize,
		);

		let scrollLeft, scrollTop;

		if (contentInlineSize < sectionInlineSize) {
			switch (startPosition.x) {
				case 'start':
					scrollLeft = sectionInlineSize - contentInlineSize;
					break;
				case 'center':
					scrollLeft = .5 * (sectionInlineSize - contentInlineSize);
					break;
				case 'end':
				default:
					scrollLeft = 0;
			}

			switch (startPosition.y) {
				case 'start':
					scrollTop = sectionBlockSize - contentBlockSize;
					break;
				case 'center':
					scrollTop = .5 * (sectionBlockSize - contentBlockSize);
					break;
				case 'end':
				default:
					scrollTop = 0;
			}
		} else {
			switch (startPosition.x) {
				case 'start':
					scrollLeft = 0;
					break;
				case 'center':
					scrollLeft = .5 * (contentInlineSize - sectionInlineSize);
					break;
				case 'end':
				default:
					scrollLeft = contentInlineSize - sectionInlineSize;
			}

			switch (startPosition.y) {
				case 'start':
					scrollTop = 0;
					break;
				case 'center':
					scrollTop = .5 * (contentBlockSize - sectionBlockSize);
					break;
				case 'end':
				default:
					scrollTop = contentBlockSize - sectionBlockSize;
			}
		}

		this.#size = {
			inline: sectionInlineSize,
			block: sectionBlockSize,
		};

		if (this.constructor.log) console.log(startPosition, scrollLeft, scrollTop);
		this.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'instant' });
	}
	boundInitializeScrollPosition = this.initializeScrollPosition.bind(this);


	#size = { inline: 0, block: 0 };
	#currentZoomLevel = 1;

	get currentZoomLevel() {
		return this.#currentZoomLevel;
	}

	set currentZoomLevel(zoomLevel) {
		this.zoom(zoomLevel, { x: this.#size.inline / 2, y: this.#size.block / 2 });
	}

	defaultMinZoomLevel = .25;
	minZoomLevel = this.defaultMinZoomLevel;

	defaultMaxZoomLevel = 4;
	maxZoomLevel = this.defaultMaxZoomLevel;


	parseZoomLevel(level) {
		if (typeof level === 'string') {
			if (level.endsWith('%')) return parseFloat(level) / 100;
			else return parseFloat(level);
		} else if (typeof level === 'number') {
			return level;
		} else {
			throw new Error('Zoom level must be parsed from a string or number');
		}
	}


	zoom(
		zoomLevel,
		zoomPoint,
		sectionRect,
	) {
		zoomLevel = Math.max(this.minZoomLevel, Math.min(zoomLevel, this.maxZoomLevel));

		// On récupère la position du point de zoom en pourcentage du contenu
		// - position horizontale
		const contentInlineSize = this.#contentSize.inline * this.#currentZoomLevel;
		const sectionX = zoomPoint.x - sectionRect.x;
		const sectionScrollX = this.scrollLeft + sectionX;
		const contentX = sectionScrollX - this.#scrollMargins.inline;
		const pctX = contentX / contentInlineSize;
		// - position verticale
		const contentBlockSize = this.#contentSize.block * this.#currentZoomLevel;
		const sectionY = zoomPoint.y - sectionRect.y;
		const sectionScrollY = this.scrollTop + sectionY;
		const contentY = sectionScrollY - this.#scrollMargins.block;
		const pctY = contentY / contentBlockSize;

		// On applique le nouveau niveau de zoom
		this.contentScaleContainer.style.setProperty('--zoom-level', zoomLevel.toFixed(8));
		this.#currentZoomLevel = zoomLevel;

		// On redimensionne le slot pour maintenir le contenu "prisonnier" de la section
		// lors du scroll quand il est plus petit que la section
		this.#resizeScrollMarginContainer(
			this.#contentSize.inline * zoomLevel,
			this.#contentSize.block * zoomLevel,
			this.#size.inline,
			this.#size.block,
		);

		// On calcule la nouvelle position de scroll de la section pour maintenir le point
		// de zoom au même endroit
		// - position horizontale
		const newContentInlineSize = this.#contentSize.inline * zoomLevel;
		const newContentX = pctX * newContentInlineSize;
		const newSectionScrollX = newContentX + this.#scrollMargins.inline;
		const newScrollLeft = newSectionScrollX - sectionX;
		// - position verticale
		const newContentBlockSize = this.#contentSize.block * zoomLevel;
		const newContentY = pctY * newContentBlockSize;
		const newSectionScrollY = newContentY + this.#scrollMargins.block;
		const newScrollTop = newSectionScrollY - sectionY;

		// On applique la nouvelle position du scroll
		this.scrollTo({
			left: newScrollLeft,
			top: newScrollTop,
			behavior: 'instant',
		});
	}


	connectedCallback() {
		this.addEventListener('pointerdown', this.boundOnPointerDown);
		this.addEventListener('wheel', this.boundOnWheel);
		this.addEventListener('contextmenu', this.boundOnContextMenu);
		this.slot.addEventListener('slotchange', this.boundOnSlotChange);
		this.addEventListener('resized-content', this.boundInitializeScrollPosition);
	}

	disconnectedCallback() {
		this.removeEventListener('pointerdown', this.boundOnPointerDown);
		this.removeEventListener('wheel', this.boundOnWheel);
		this.removeEventListener('contextmenu', this.boundOnContextMenu);
		this.slot.removeEventListener('slotchange', this.boundOnSlotChange);
		this.removeEventListener('resized-content', this.boundInitializeScrollPosition);
		this.disconnectAllTemporaryEventListeners();
	}

	connectedMoveCallback() {
		// do nothing
	}

	static get observedAttributes() {
		return ['min-zoom-level', 'max-zoom-level', 'zoom-level'];
	}

	attributeChangedCallback(attr, oldValue, newValue) {
		if (oldValue === newValue) return;

		switch (attr) {
			case 'min-zoom-level': {
				if (newValue == null) this.minZoomLevel = this.defaultMinZoomLevel;
				else this.minZoomLevel = this.parseZoomLevel(newValue);
				if (this.currentZoomLevel < this.minZoomLevel) {
					this.currentZoomLevel = this.minZoomLevel;
				}
			} break;

			case 'max-zoom-level': {
				if (newValue == null) this.maxZoomLevel = this.defaultMaxZoomLevel;
				else this.maxZoomLevel = this.parseZoomLevel(newValue);
				if (this.currentZoomLevel > this.maxZoomLevel) {
					this.currentZoomLevel = this.maxZoomLevel;
				}
			} break;

			case 'zoom-level': {
				if (newValue == null) return;
				this.currentZoomLevel = this.parseZoomLevel(newValue);
			} break;
		}
	}
}

if (!customElements.get('scroll-zoom-block')) customElements.define('scroll-zoom-block', ScrollZoomBlock);