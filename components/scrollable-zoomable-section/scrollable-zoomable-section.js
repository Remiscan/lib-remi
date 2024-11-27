const template = document.createElement('template');
template.innerHTML = /*html*/`
	<slot></slot>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
	:host {
		contain: size;
		overflow: hidden;
		touch-action: none;
		cursor: move;
	}

	slot {
		display: grid;
		place-items: center;
		inline-size: var(--inline-size, 100%);
		block-size: var(--block-size, 100%);
	}
`);



const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		if (entry.borderBoxSize?.length > 0) {
			const section = entry.target.closest('scrollable-zoomable-section');
			const sectionStyles = window.getComputedStyle(section);
			const sectionInlineSize = Number(sectionStyles.getPropertyValue('inline-size').replace('px', ''));
			const sectionBlockSize = Number(sectionStyles.getPropertyValue('block-size').replace('px', ''));

			const borderBoxSize = entry.borderBoxSize[0];
			const contentInlineSize = borderBoxSize.inlineSize;
			const contentBlockSize = borderBoxSize.blockSize;

			const slotInlineSize = contentInlineSize < sectionInlineSize
				? contentInlineSize + 2 * (sectionInlineSize - contentInlineSize)
				: contentInlineSize;
			const slotBlockSize = contentBlockSize < sectionBlockSize
				? contentBlockSize + 2 * (sectionBlockSize - contentBlockSize)
				: contentBlockSize;

			console.log(sectionInlineSize, sectionBlockSize, contentInlineSize, contentBlockSize);

			section.slot.style.setProperty('--inline-size', `${slotInlineSize}px`);
			section.slot.style.setProperty('--block-size', `${slotBlockSize}px`);

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



export class ScrollableZoomableSection extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.appendChild(template.content.cloneNode(true));
		this.shadow.adoptedStyleSheets = [sheet];
	}


	get slot() {
		return this.shadow.querySelector('slot');
	}


	/** Timestamp du dernier event `pointerup`. */
	lastPointerUpTime = 0;

	/** Compteur du nombre d'events `pointerup` depuis le dernier double-tap. */
	pointerUpsCount = 0;

	/** Le délai maximal entre deux events `pointerup` pour déclencher un double-tap. */
	maxDoubleTapDelay = 500; // ms

	/** Le nombre minimal de pixels dont l'event `pointermove` doit bouger par rapport à la position initiale. En-dessous, on ignore le `pointermove` (car sinon, l'imprécision avec un doigt déclenche l'événement). */
	minMoveThreshold = 10; // px

	/** Liste des pointeurs actuellement down. */
	currentPointerDownEvents = new Set();

	/** Liste des pointeurs actuellement en mouvement. */
	currentPointersMoving = new Set();

	/** Associe à chaque pointeur un AbortController. */
	currentPointersAbortControllers = new Map();

	/** Timestamp du dernier event `wheel`. */
	lastWheelTime = 0;

	/** Si l'event `wheel` est en attente de la prochaine frame. */
	wheelDebounce = false;


	/**
	 * Quand le pointeur touche la section, on écoute les événements requis pour détecter :
	 * - le scroll (pour scroller la section)
	 * - le double clic (pour zoomer la section)
	 * - le double clic puis scroll (pour zoomer la section)
	 * - le pinch (pour zoomer la section)
	 */
	onPointerDown(downEvent) {
		// Si le pointeur est une souris, on l'ignore s'il n'est pas le bouton principal
		if (downEvent.pointerType === 'mouse' && downEvent.button !== 0) return;

		this.setPointerCapture(downEvent.pointerId);
		this.currentPointerDownEvents.add(downEvent);

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
		if (this.currentPointersMoving.has(moveEvent.pointerId)) return;
		this.currentPointersMoving.add(moveEvent.pointerId);

		let action = '';
		switch (this.currentPointerDownEvents.size) {
			case 1: {
				if (isCandidateForDoubleTap) action = 'doubleTapScroll';
				else action = 'scroll';
			} break;
			case 2: action = 'pinch'; break;
		}

		switch (action) {
			// ✅ FAIT
			case 'scroll': {
				this.scrollTo({
					left: startScrollPosition.x - (moveEvent.clientX - downEvent.clientX),
					top: startScrollPosition.y - (moveEvent.clientY - downEvent.clientY),
					behavior: 'instant',
				});
				console.log('move', 'scroll', {
					left: startScrollPosition.x - (moveEvent.clientX - downEvent.clientX),
					top: startScrollPosition.y - (moveEvent.clientY - downEvent.clientY)
				});
			} break;

			// À FAIRE
			case 'doubleTapScroll': {
				console.log('doubleTapScroll');
			} break;

			// À FAIRE
			case 'pinch': {
				console.log('pinch');
			} break;
		}

		requestAnimationFrame(() => this.currentPointersMoving.delete(moveEvent.pointerId));
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
		console.log('up', upEvent);
		this.pointerUpsCount++;
		const now = Date.now();
		this.lastPointerUpTime = now;
		/*const distanceMoved = Math.sqrt(
			Math.pow()
		)*/

		if (
			this.pointerUpsCount === 2
			&& now - this.lastPointerUpTime < this.maxDoubleTapDelay
		) {}

		this.onPointerCancel(upEvent, downEvent);
	}


	/**
	 * Quand le pointeur est annulé, on retire les event listeners.
	 */
	onPointerCancel(
		cancelEvent,
		downEvent,
	) {
		console.log('cancel', cancelEvent);
		const abortController = this.currentPointersAbortControllers.get(cancelEvent.pointerId);
		if (abortController) {
			abortController.abort();
			this.currentPointersAbortControllers.delete(cancelEvent.pointerId);
		}
		this.currentPointerDownEvents.delete(downEvent);
	}


	onWheel(event) {
		if (this.wheelDebounce) return;
		this.wheelDebounce = true;

		requestAnimationFrame(() => this.wheelDebounce = false);
	}
	boundOnWheel = this.onWheel.bind(this);


	onDoubleTap(event) {

	}
	boundOnDoubleTap = this.onDoubleTap.bind(this);


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

		console.log(startPositionX, startPositionY);

		return {
			x: startPositionX,
			y: startPositionY
		};
	}


	initializeScrollPosition(event) {
		const startPosition = this.startPosition;
		const { sectionInlineSize, sectionBlockSize, contentInlineSize, contentBlockSize } = event.detail;

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

		console.log(startPosition, scrollLeft, scrollTop);
		this.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'instant' });
	}
	boundInitializeScrollPosition = this.initializeScrollPosition.bind(this);


	connectedCallback() {
		this.addEventListener('pointerdown', this.boundOnPointerDown);
		this.addEventListener('wheel', this.boundOnWheel);
		this.slot.addEventListener('slotchange', this.boundOnSlotChange);
		this.addEventListener('resized-content', this.boundInitializeScrollPosition);
	}

	disconnectedCallback() {
		this.removeEventListener('pointerdown', this.boundOnPointerDown);
		this.removeEventListener('wheel', this.boundOnWheel);
		this.slot.removeEventListener('slotchange', this.boundOnSlotChange);
		this.removeEventListener('resized-content', this.boundInitializeScrollPosition);
		this.disconnectAllTemporaryEventListeners();
	}

	connectedMoveCallback() {
		// do nothing
	}
}

if (!customElements.get('scrollable-zoomable-section')) customElements.define('scrollable-zoomable-section', ScrollableZoomableSection);