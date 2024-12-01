// @ts-check
import { Point2D as BasePoint2D } from "../../js/geometry/mod.js";



// MARK: Point2D
class Point2D extends BasePoint2D {
	round() {
		return new Point2D(
			Math.round(this.x),
			Math.round(this.y),
		);
	}

	positionVectorLength() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
}



// MARK: TEMPLATE
const template = document.createElement('template');
template.innerHTML = /*html*/`
	<div class="scroll-margin-container">
		<div class="content-scale-container">
			<slot></slot>
		</div>
	</div>
`;



// MARK: STYLES
const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
	:host {
		display: block;
		contain: size;
		overflow: hidden;
		touch-action: none;
		user-select: none;
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



// MARK: TYPES

/** @typedef {'start' | 'center' | 'end'} Alignment */
/** @typedef {{ x: Alignment, y: Alignment }} StartPosition */
/** @typedef {{ inline: number, block: number }} Size */
/** @typedef { PointerEvent & Partial<{ couldBecomeDoubleTap: boolean, becameDoubleTap: boolean, hasMovedSignificantly: boolean, startScrollPosition: Point2D }> } ExtPointerDownEvent */
/** @typedef {{ centerPoint: Point2D, averageRadius: number }} PinchData */



// MARK: OBSERVER
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		if (entry.borderBoxSize?.length > 0) {
			const section = entry.target.closest('scroll-zoom-block');
			if (!(section instanceof ScrollZoomBlock)) continue;

			const sectionStyles = window.getComputedStyle(section);
			const sectionInlineSize = Number(sectionStyles.getPropertyValue('inline-size').replace('px', ''));
			const sectionBlockSize = Number(sectionStyles.getPropertyValue('block-size').replace('px', ''));

			const borderBoxSize = entry.borderBoxSize[0];
			const contentInlineSize = borderBoxSize.inlineSize;
			const contentBlockSize = borderBoxSize.blockSize;
			section.initializeScrollPosition(
				{ inline: sectionInlineSize, block: sectionBlockSize },
				{ inline: contentInlineSize, block: contentBlockSize },
			);
		}
	}
});



export class ScrollZoomBlock extends HTMLElement {

	// ----------------------
	// #region INITIALISATION


	// MARK: Component lifecycle


	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.appendChild(template.content.cloneNode(true));
		this.shadow.adoptedStyleSheets = [sheet];
	}


	connectedCallback() {
		this.addEventListener('pointerdown', this.boundOnPointerDown);
		this.addEventListener('wheel', this.boundOnWheel, { passive: false });
		this.addEventListener('contextmenu', this.boundOnContextMenu);
		this.contentSlot?.addEventListener('slotchange', this.boundOnSlotChange);
	}


	disconnectedCallback() {
		this.removeEventListener('pointerdown', this.boundOnPointerDown);
		this.removeEventListener('wheel', this.boundOnWheel);
		this.removeEventListener('contextmenu', this.boundOnContextMenu);
		this.contentSlot?.removeEventListener('slotchange', this.boundOnSlotChange);
		this.disconnectAllTemporaryEventListeners();
	}


	connectedMoveCallback() {
		// do nothing
	}


	static get observedAttributes() {
		return ['min-zoom-level', 'max-zoom-level', 'zoom-level'];
	}


	/**
	 * @param {string} attr 
	 * @param {string|null} oldValue 
	 * @param {string|null} newValue 
	 */
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


	// MARK: Part getters


	/** @returns {HTMLElement | null} */
	get scrollMarginContainer() {
		return this.shadow.querySelector('.scroll-margin-container');
	}

	/** @returns {HTMLElement | null} */
	get contentScaleContainer() {
		return this.shadow.querySelector('.content-scale-container');
	}

	/** @returns {HTMLSlotElement | null} */
	get contentSlot() {
		return this.shadow.querySelector('slot');
	}


	// MARK: Position initialisation


	/**
	 * @param {Event} event
	 */
	onSlotChange(event) {
		const slot = event.target;
		if (!(slot instanceof HTMLSlotElement)) return;

		const assignedElements = slot.assignedElements();
		for (const element of assignedElements) {
			resizeObserver.observe(element);
		}
	}
	boundOnSlotChange = this.onSlotChange.bind(this);


	/**
	 * @param {string} position
	 * @returns {Alignment}
	 */
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

	/** @returns {StartPosition} */
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

		return {
			x: startPositionX,
			y: startPositionY
		};
	}


	/** @type {Size} */
	#scrollMargins = {
		inline: 0,
		block: 0,
	};

	/** @type {Size} */
	#contentSize = {
		inline: 0,
		block: 0,
	}

	/** @type {Size} */
	#size = {
		inline: 0,
		block: 0
	};


	/**
	 * @param {number} zoomLevel 
	 * @returns {Size}
	 */
	#computeScrollMargins(zoomLevel) {
		// On utilise `Math.floor` car on veut que la marge soit permette **au maximum** de scroller le contenu jusqu'au bord.
		// Avec `round` ou `ceil`, la marge pourrait être 1px plus grande, donc permettre de scroller 1px plus loin, donc faire overflow le contenu de 1px.
		const marginInline = Math.max(0, Math.floor(this.#size.inline - this.#contentSize.inline * zoomLevel));
		const marginBlock = Math.max(0, Math.floor(this.#size.block - this.#contentSize.block * zoomLevel));

		return {
			inline: marginInline,
			block: marginBlock,
		};
	}


	/**
	 * @param {number} zoomLevel 
	 * @param {Size} scrollMargins 
	 */
	#applyScrollMargins(zoomLevel, scrollMargins = this.#computeScrollMargins(zoomLevel)) {
		const scrollMarginContainer = this.scrollMarginContainer;
		if (!scrollMarginContainer) throw new TypeError('Expecting HTMLElement');
		scrollMarginContainer.style.setProperty('--inline-size', `${Math.ceil(this.#contentSize.inline * zoomLevel + 2 * scrollMargins.inline)}px`);
		scrollMarginContainer.style.setProperty('--block-size', `${Math.ceil(this.#contentSize.block * zoomLevel + 2 * scrollMargins.block)}px`);
		this.#scrollMargins = scrollMargins;
	}


	#isInitialized = false;

	/** @returns {Promise<void>} */
	get isInitialized() {
		return new Promise((resolve) => {
			if (this.#isInitialized) return resolve();
			this.addEventListener('initialized', () => resolve(), { once: true });
		});
	}


	/**
	 * @param {Size} sectionSize 
	 * @param {Size} contentSize 
	 */
	initializeScrollPosition(
		sectionSize,
		contentSize,
	) {
		const startPosition = this.startPosition;

		this.#contentSize = contentSize;
		this.#size = sectionSize;

		const zoomLevel = this.currentZoomLevel;
		const scrollMargins = this.#computeScrollMargins(zoomLevel);
		this.#applyScrollMargins(zoomLevel, scrollMargins);

		let scrollLeft, scrollTop;

		if (contentSize.inline < sectionSize.inline) {
			switch (startPosition.x) {
				case 'start':
					scrollLeft = scrollMargins.inline;
					break;
				case 'end':
					scrollLeft = 0;
					break;
				case 'center':
				default:
					scrollLeft = scrollMargins.inline + .5 * (zoomLevel * contentSize.inline - sectionSize.inline);
					break;
			}
		} else {
			switch (startPosition.x) {
				case 'start':
					scrollLeft = 0;
					break;
				case 'end':
					scrollLeft = 2 * scrollMargins.inline + zoomLevel * contentSize.inline;
					break;
				case 'center':
				default:
					scrollLeft = scrollMargins.inline + .5 * (zoomLevel * contentSize.inline - sectionSize.inline);
					break;
			}
		}

		if (contentSize.block < sectionSize.block) {
			switch (startPosition.y) {
				case 'start':
					scrollTop = scrollMargins.block;
					break;
				case 'end':
					scrollTop = 0;
					break;
				case 'center':
				default:
					scrollTop = scrollMargins.block + .5 * (zoomLevel * contentSize.block - sectionSize.block);
					break;
			}
		} else {
			switch (startPosition.y) {
				case 'start':
					scrollTop = 0;
					break;
				case 'end':
					scrollTop = 2 * scrollMargins.block + zoomLevel * contentSize.block;
					break;
				case 'center':
				default:
					scrollTop = scrollMargins.block + .5 * (zoomLevel * contentSize.block - sectionSize.block);
					break;
			}
		}

		scrollLeft = Math.round(scrollLeft);
		scrollTop = Math.round(scrollTop);

		console.log(contentSize, sectionSize, scrollLeft, scrollTop);
		this.scrollTo({
			left: scrollLeft,
			top: scrollTop,
			behavior: 'instant'
		});

		this.#isInitialized = true;
		this.dispatchEvent(new Event('initialized'));
	}


	// #endregion
	// ----------------------



	// --------------------
	// #region INTERACTIONS


	/** Timestamp du dernier event `pointerup`. */
	lastPointerUpTime = 0;

	/**
	 * Précédent event `pointerdown`.
	 * @type {ExtPointerDownEvent | undefined}
	 */
	lastPointerDownEvent = undefined;

	/** Compteur du nombre d'events `pointerup` depuis le dernier double-tap. */
	pointerUpsCount = 0;

	/** Le délai maximal entre deux events `pointerup` pour déclencher un double-tap. */
	maxDoubleTapDelay = 500; // ms

	/** Le nombre minimal de pixels dont l'event `pointermove` doit bouger par rapport à la position initiale. En-dessous, on ignore le `pointermove` (car sinon, l'imprécision avec un doigt déclenche l'événement). */
	minMoveThreshold = 10; // px

	/**
	 * Liste des pointeurs actuellement down avec leur event `pointerdown`.
	 * @type {Map<number, ExtPointerDownEvent>}
	 */
	currentPointerDownEvents = new Map();

	/**
	 * Liste des pointeurs actuellement en mouvement avec leur event `pointermove`.
	 * @type {Map<number, PointerEvent>}
	 */
	currentPointerMoveEvents = new Map();

	/** @type {(PinchData & { startZoomLevel: number }) | null} */
	lastPinchData = null;

	/** Si l'event `pointermove` est en attente de la prochaine frame. */
	pointermoveDebounce = false;

	/** Si l'event `wheel` est en attente de la prochaine frame. */
	wheelDebounce = false;

	/** Timeout pour reset le compteur de `pointerup`. */
	pointerUpTimeout = -1;


	/** @returns {Point2D} */
	get scrollPosition() {
		return new Point2D(this.scrollLeft, this.scrollTop);
	}


	// MARK: pointerdown
	/**
	 * Quand le pointeur touche la section, on écoute les événements requis pour détecter :
	 * - le clic maintenu puis glissé (pour scroller la section)
	 * - le double clic (pour zoomer la section, ou dézoomer si clic droit souris)
	 * - le double clic maintenu puis glissé verticalement (pour zoomer la section si vers le bas, dézoomer si vers le haut)
	 * - le pinch (pour zoomer la section si écarté, dézoomer si rapproché)
	 * 
	 * @param {ExtPointerDownEvent} downEvent
	 */
	onPointerDown(downEvent) {
		downEvent.preventDefault();

		this.setPointerCapture(downEvent.pointerId);
		this.currentPointerDownEvents.set(downEvent.pointerId, downEvent);

		const abortController = new AbortController();
		this.currentPointersAbortControllers.set(downEvent.pointerId, abortController);

		const pointerDownTime = Date.now();

		downEvent.couldBecomeDoubleTap = this.currentPointerDownEvents.size === 1
			&& typeof this.lastPointerDownEvent !== 'undefined'
			&& !this.lastPointerDownEvent.hasMovedSignificantly
			&& !this.lastPointerDownEvent.becameDoubleTap
			&& (pointerDownTime - this.lastPointerUpTime) < this.maxDoubleTapDelay;
		downEvent.startScrollPosition = this.scrollPosition;

		/** @type {Set<PointerEvent>} */
		const pinchPointerEvents = new Set();
		for (const [pointerId, evt] of this.currentPointerDownEvents.entries()) {
			const mvEvt = this.currentPointerMoveEvents.get(pointerId);
			if (mvEvt) pinchPointerEvents.add(mvEvt);
			else pinchPointerEvents.add(evt);
		}
		this.lastPinchData = {
			...this.computeCenterAndAverageRadius(pinchPointerEvents),
			startZoomLevel: this.currentZoomLevel,
		};

		const onPointerMove = (moveEvent) => this.onPointerMove.bind(this)(moveEvent, downEvent);
		const onPointerUp = (upEvent) => this.onPointerUp.bind(this)(upEvent, downEvent);
		const onPointerCancel = (cancelEvent) => this.onPointerCancel.bind(this)(cancelEvent, downEvent);

		const abortSignal = abortController.signal;
		this.addEventListener('pointermove', onPointerMove, { signal: abortSignal });
		this.addEventListener('pointerup', onPointerUp, { signal: abortSignal });
		this.addEventListener('pointercancel', onPointerCancel, { signal: abortSignal });
	}
	boundOnPointerDown = this.onPointerDown.bind(this);


	// MARK: pointermove
	/**
	 * Quand le pointeur se déplace, on détermine si :
	 * - un seul pointeur est down, auquel cas :
	 *     - si on est après un double-tap, on dé/zoome si le mouvement est vertical
	 *     - sinon, on scrolle dans la section
	 * - deux points sont down, auquel cas :
	 *     - on lance un événement custom `pinch`
	 * 
	 * @param {PointerEvent} moveEvent
	 * @param {ExtPointerDownEvent} downEvent
	 */
	onPointerMove(
		moveEvent,
		downEvent,
	) {
		moveEvent.preventDefault();

		this.currentPointerMoveEvents.set(moveEvent.pointerId, moveEvent);

		if (this.pointermoveDebounce) return;
		this.pointermoveDebounce = true;

		const deltaX = moveEvent.clientX - downEvent.clientX;
		const deltaY = moveEvent.clientY - downEvent.clientY;
		const deltaDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

		if (deltaDistance > this.minMoveThreshold) {
			downEvent.hasMovedSignificantly = true;
		}

		let interaction = '';
		switch (this.currentPointerMoveEvents.size) {
			case 0:
				break;
			case 1:
				if (
					downEvent.couldBecomeDoubleTap
					&& downEvent.pointerType === 'touch'
					&& this.lastPointerDownEvent?.pointerType === 'touch'
				) {
					interaction = 'doubleTapScroll';
				}

				// Cette condition permet d'éviter un sursaut visuel à l'ajout d'un pointeur
				else if (
					this.lastPinchData
					&& this.currentPointerDownEvents.size === this.currentPointerMoveEvents.size
				) {
					interaction = 'scroll';
				}
				break;
			default:
				if (
					this.lastPinchData
					&& this.currentPointerDownEvents.size === this.currentPointerMoveEvents.size
				) {
					interaction = 'pinch';
				}
		}

		switch (interaction) {
			// ✅ FAIT
			case 'scroll':
			// ✅ FAIT
			case 'pinch': {
				const numberOfPointers = this.currentPointerMoveEvents.size;
				const { centerPoint, averageRadius } = this.computeCenterAndAverageRadius(this.currentPointerMoveEvents);

				const interactionDetail = interaction === 'scroll'
					? {
						scrollPosition: centerPoint,
					}
					: {
						numberOfPointers: numberOfPointers,
						pinchCenter: centerPoint,
						pinchRadius: averageRadius,
					};

				this.dispatchInteractionEvent('before', interaction, interactionDetail);

				const lastPinchData = this.lastPinchData;
				if (!lastPinchData) throw new Error('Impossible');

				if (numberOfPointers > 1) {
					const radiusRatio = averageRadius / lastPinchData.averageRadius;
					if (Number.isFinite(radiusRatio)) {
						const zoomLevel = lastPinchData.startZoomLevel * radiusRatio;
						this.zoom(zoomLevel, centerPoint);
					}
				}

				const scrollPosition = this.scrollPosition
					.translate(
						-(centerPoint.x - lastPinchData.centerPoint.x),
						-(centerPoint.y - lastPinchData.centerPoint.y),
					)
					.round();

				this.scrollTo({
					left: scrollPosition.x,
					top: scrollPosition.y,
					behavior: 'instant',
				});
				lastPinchData.centerPoint = centerPoint;

				this.dispatchInteractionEvent('after', interaction, interactionDetail);
			} break;

			// ✅ FAIT
			case 'doubleTapScroll': {
				if (!this.lastPinchData) throw new Error('impossible');

				const deltaY = moveEvent.clientY - downEvent.clientY;
				const sensitivity = .01;
				const zoomScale = (moveEvent.clientY - downEvent.clientY) * sensitivity;

				const interactionDetail = {
					deltaY: deltaY,
				};

				this.dispatchInteractionEvent('before', interaction, interactionDetail);

				// Passer le startZoomLevel et la startScrollPosition à la fonction zoom()
				// permet d'éviter un décalage progressif pendant qu'on zoome
				this.zoom(
					this.lastPinchData.startZoomLevel * Math.exp(zoomScale),
					undefined,
					undefined,
					this.lastPinchData.startZoomLevel,
					downEvent.startScrollPosition,
				);

				this.dispatchInteractionEvent('after', interaction, interactionDetail);
			} break;

			default:
				this.dispatchInteractionEvent('before', interaction);
				this.dispatchInteractionEvent('before', interaction);
		}

		requestAnimationFrame(() => this.pointermoveDebounce = false);
	}


	// MARK: pointerup
	/**
	 * Quand le pointeur quitte la page, on détermine si :
	 * - c'est le deuxième pointeur à quitter la page en moins de `this.maxDoubleTapDelay` alors qu'il n'y avait qu'un pointeur sur la page, auquel cas :
	 *     - on lance un événement custom `double-tap`
	 * 
	 * @param {PointerEvent} upEvent
	 * @param {ExtPointerDownEvent} downEvent
	 */
	onPointerUp(
		upEvent,
		downEvent,
	) {
		upEvent.preventDefault();

		this.pointerUpsCount++;

		const now = Date.now();

		clearTimeout(this.pointerUpTimeout);
		if (downEvent.hasMovedSignificantly) {
			this.pointerUpsCount = 0;
		} else {
			this.pointerUpTimeout = setTimeout(() => this.pointerUpsCount = 0, this.maxDoubleTapDelay);
		}

		let interaction = '';
		if (this.pointerUpsCount === 2) {
			this.pointerUpsCount = 0
			if (
				downEvent.couldBecomeDoubleTap
				&& !downEvent.hasMovedSignificantly
				&& (
					downEvent.pointerType !== 'mouse'
					|| (
						downEvent.button === this.lastPointerDownEvent?.button
						&& (downEvent.button === 0 || downEvent.button === 2)
					)
				)
			) {
				interaction = 'doubleTap';
			}
		}

		switch (interaction) {
			// ✅ FAIT
			case 'doubleTap': {
				downEvent.becameDoubleTap = true;
				const zoomDirection = upEvent.button === 2 ? -1 : 1;
				const zoomPoint = new Point2D(
					Math.round(upEvent.clientX),
					Math.round(upEvent.clientY),
				);

				const interactionDetail = {
					direction: zoomDirection,
					point: zoomPoint,
				};

				this.dispatchInteractionEvent('before', interaction, interactionDetail);

				this.smoothZoom(
					(1.7 ** zoomDirection) * this.currentZoomLevel,
					zoomPoint,
				).then(() => {
					this.dispatchInteractionEvent('after', interaction, interactionDetail);
				});
			} break;

			default:
				this.lastPointerWasDoubleTap = false;
				this.dispatchInteractionEvent('before', interaction);
				this.dispatchInteractionEvent('after', interaction);
		}

		this.lastPointerUpTime = now;

		this.onPointerCancel(upEvent, downEvent);
	}


	// MARK: pointercancel
	/**
	 * Quand le pointeur est annulé, on retire les event listeners.
	 * 
	 * @param {PointerEvent} cancelEvent
	 * @param {ExtPointerDownEvent} downEvent
	 */
	onPointerCancel(
		cancelEvent,
		downEvent,
	) {
		const abortController = this.currentPointersAbortControllers.get(cancelEvent.pointerId);
		if (abortController) {
			abortController.abort();
			this.currentPointersAbortControllers.delete(cancelEvent.pointerId);
		}

		this.currentPointerDownEvents.delete(cancelEvent.pointerId);
		this.currentPointerMoveEvents.delete(cancelEvent.pointerId);
		if (this.currentPointerDownEvents.size <= 0) {
			this.lastPinchData = null;
		} else {
			// On recalcule la lastPinchData sans le pointeur qu'on vient de retirer,
			// pour que les pointeurs restants puissent continuer leur pinch sans interruption
			// ni sursaut visuel
			this.lastPinchData = {
				...this.computeCenterAndAverageRadius(this.currentPointerMoveEvents),
				startZoomLevel: this.currentZoomLevel,
			};
		}

		this.lastPointerDownEvent = downEvent;
	}


	// MARK: wheel
	/**
	 * @param {WheelEvent} event 
	 */
	onWheel(event) {
		if (this.wheelDebounce) return;
		this.wheelDebounce = true;

		const interaction = 'wheel';

		// ✅ FAIT
		const zoomRatio = 1 - .1 * Math.sign(event.deltaY);

		const interactionDetail = {
			direction: Math.sign(event.deltaY),
		};

		this.dispatchInteractionEvent('before', interaction, interactionDetail);

		this.zoom(
			this.currentZoomLevel * zoomRatio,
			new Point2D(event.clientX, event.clientY),
		);

		this.dispatchInteractionEvent('after', interaction, interactionDetail);

		requestAnimationFrame(() => this.wheelDebounce = false);
	}
	boundOnWheel = this.onWheel.bind(this);


	// MARK: contextmenu
	/**
	 * @param {Event} event
	 */
	onContextMenu(event) {
		event.preventDefault();
	}
	boundOnContextMenu = this.onContextMenu.bind(this);


	// MARK: CustomEvent
	/**
	 * @param {'before'|'after'} timing 
	 * @param {string} interaction 
	 * @param {Record<string, unknown>} detail 
	 */
	dispatchInteractionEvent(timing, interaction, detail = {}) {
		let type;
		switch (timing) {
			case 'before': type = 'before-interaction'; break;
			case 'after': type = 'after-interaction'; break;
			default: throw new Error("Cannot dispatch an interaction event that is neither before nor after interaction");
		}

		if (!interaction) interaction = 'none';
		detail.interaction = interaction;
		this.dispatchEvent(
			new CustomEvent(type, {
				bubbles: true,
				composed: true,
				detail: detail,
			})
		);
	}


	// MARK: abort EventListeners

	/**
	 * Associe à chaque pointeur un AbortController.
	 * @type {Map<number, AbortController>}
	 */
	currentPointersAbortControllers = new Map();

	disconnectAllTemporaryEventListeners() {
		for (const abortController of this.currentPointersAbortControllers.values()) {
			abortController.abort();
		}
		this.currentPointersAbortControllers.clear();
	}


	// #endregion
	// ----------------------



	// ------------
	// #region ZOOM


	defaultMinZoomLevel = .25;
	minZoomLevel = this.defaultMinZoomLevel;

	defaultMaxZoomLevel = 4;
	maxZoomLevel = this.defaultMaxZoomLevel;

	#currentZoomLevel = 1;

	get currentZoomLevel() {
		return this.#currentZoomLevel;
	}

	set currentZoomLevel(zoomLevel) {
		this.isInitialized.then(
			() => this.zoom(zoomLevel)
		);
	}


	/**
	 * @param {Set<PointerEvent> | Map<any, PointerEvent>} pointerEvents
	 * @returns {PinchData}
	 */
	computeCenterAndAverageRadius(pointerEvents) {
		let numberOfEvents = 0;

		let centerPoint = new Point2D();
		for (const evt of pointerEvents.values()) {
			centerPoint = centerPoint.translate(evt.clientX, evt.clientY);
			numberOfEvents++;
		}
		centerPoint = centerPoint.scale(1 / numberOfEvents);

		let radiusTotal = 0;
		for (const evt of pointerEvents.values()) {
			radiusTotal += centerPoint
				.translate(-evt.clientX, -evt.clientY)
				.positionVectorLength();
		}

		return {
			// On arrondit seulement à la fin, pour ne pas impacter la précision du calcul du radius
			centerPoint: centerPoint.round(),
			averageRadius: radiusTotal / numberOfEvents,
		};
	}


	/**
	 * @param {string | number} level
	 * @returns {number}
	 */
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


	/**
	 * @param {number} zoomLevel 
	 * @returns {number}
	 */
	clampZoomLevel(zoomLevel) {
		return Math.max(this.minZoomLevel, Math.min(zoomLevel, this.maxZoomLevel));
	}


	/**
	 * @param {number} zoomLevel 
	 * @param {Point2D} zoomPoint 
	 * @param {DOMRect} sectionRect 
	 * @param {number} oldZoomLevel 
	 * @param {Point2D} oldScrollPosition 
	 * @returns {{ zoomLevel: number, newScrollMargins: Size, newScrollPosition: Point2D }}
	 */
	#computeZoom(
		zoomLevel,
		zoomPoint,
		sectionRect,
		oldZoomLevel,
		oldScrollPosition,
	) {
		zoomLevel = this.clampZoomLevel(zoomLevel);

		const contentSizeWithOldZoom = {
			inline: this.#contentSize.inline * oldZoomLevel,
			block: this.#contentSize.block * oldZoomLevel,
		};

		const contentSizeWithNewZoom = {
			inline: this.#contentSize.inline * zoomLevel,
			block: this.#contentSize.block * zoomLevel,
		};

		const newScrollMargins = this.#computeScrollMargins(zoomLevel);

		// On récupère la position du point de zoom en pourcentage du contenu
		const zoomPointRelativeToSection = zoomPoint
			.translate(-sectionRect.x, -sectionRect.y);
		const zoomPointAsPercentageOfContent = zoomPointRelativeToSection
			.translate(oldScrollPosition.x, oldScrollPosition.y)
			.translate(-this.#scrollMargins.inline, -this.#scrollMargins.block)
			.scale(1 / contentSizeWithOldZoom.inline, 1 / contentSizeWithOldZoom.block);

		// On calcule la nouvelle position de scroll de la section pour maintenir le point
		// de zoom au même endroit
		const newScrollPosition = zoomPointAsPercentageOfContent
			.scale(contentSizeWithNewZoom.inline, contentSizeWithNewZoom.block)
			.translate(newScrollMargins.inline, newScrollMargins.block)
			.translate(-zoomPointRelativeToSection.x, -zoomPointRelativeToSection.y)
			.round();

		return {
			zoomLevel,
			newScrollMargins,
			newScrollPosition,
		};
	}


	// MARK: instant zoom
	/**
	 * @param {number} zoomLevel
	 * @param {Point2D=} zoomPoint
	 * @param {DOMRect} sectionRect
	 * @param {number} oldZoomLevel
	 * @param {Point2D} oldScrollPosition
	 * @param {boolean} dispatchEvents
	 */
	zoom(
		zoomLevel,
		zoomPoint,
		sectionRect = this.getBoundingClientRect(),
		oldZoomLevel = this.currentZoomLevel,
		oldScrollPosition = new Point2D(this.scrollLeft, this.scrollTop),
		dispatchEvents = true,
	) {
		if (typeof zoomPoint === 'undefined') {
			zoomPoint = new Point2D(
				sectionRect.x + sectionRect.width / 2,
				sectionRect.y + sectionRect.height / 2,
			);
		}

		const { zoomLevel: clampedZoomLevel, newScrollMargins, newScrollPosition } = this.#computeZoom(
			zoomLevel,
			zoomPoint,
			sectionRect,
			oldZoomLevel,
			oldScrollPosition,
		)

		if (dispatchEvents) this.dispatchZoomEvent('before', zoomPoint, oldZoomLevel, clampedZoomLevel);

		// On applique le nouveau niveau de zoom
		this.contentScaleContainer?.style.setProperty('--zoom-level', clampedZoomLevel.toFixed(8));
		this.#currentZoomLevel = clampedZoomLevel;

		// On redimensionne le slot pour maintenir le contenu "prisonnier" de la section
		// lors du scroll quand il est plus petit que la section
		this.#applyScrollMargins(clampedZoomLevel, newScrollMargins);

		// On applique la nouvelle position du scroll
		this.scrollTo({
			left: newScrollPosition.x,
			top: newScrollPosition.y,
			behavior: 'instant',
		});

		if (dispatchEvents) this.dispatchZoomEvent('after', zoomPoint, oldZoomLevel, clampedZoomLevel);
	}


	// MARK: smooth zoom
	/**
	 * TODO Quand les Scoped Element Transitions existeront, s'en servir ici pour animer un seul zoom
	 *      plutôt que d'en faire un à chaque frame.
	 * 
	 * @param {number} zoomLevel
	 * @param {Point2D=} zoomPoint
	 * @param {number} zoomDuration
	 * @param {DOMRect} sectionRect
	 * @param {number} oldZoomLevel
	 * @param {Point2D} oldScrollPosition
	 */
	async smoothZoom(
		zoomLevel,
		zoomPoint,
		zoomDuration = 300, // ms
		sectionRect = this.getBoundingClientRect(),
		oldZoomLevel = this.currentZoomLevel,
		oldScrollPosition = new Point2D(this.scrollLeft, this.scrollTop),
	) {
		if (typeof zoomPoint === 'undefined') {
			zoomPoint = new Point2D(
				sectionRect.x + sectionRect.width / 2,
				sectionRect.y + sectionRect.height / 2,
			);
		}

		const startTime = Date.now();
		zoomLevel = this.clampZoomLevel(zoomLevel);

		this.dispatchZoomEvent('before', zoomPoint, oldZoomLevel, zoomLevel, true);

		const startZoomLevel = this.currentZoomLevel;
		let now = Date.now();
		while (now - startTime < zoomDuration) {
			const tempZoomLevel = startZoomLevel + (zoomLevel - startZoomLevel) * easeInOutQuad((now - startTime) / zoomDuration);

			this.zoom(tempZoomLevel, zoomPoint, sectionRect, oldZoomLevel, oldScrollPosition, false);

			await new Promise(resolve => requestAnimationFrame(resolve));
			now = Date.now();
		}

		this.zoom(zoomLevel, zoomPoint, sectionRect, oldZoomLevel, oldScrollPosition, false);

		this.dispatchZoomEvent('after', zoomPoint, oldZoomLevel, zoomLevel, true);
	}


	// MARK: CustomEvent
	/**
	 * @param {'before' | 'after'} timing
	 * @param {Point2D} zoomPoint
	 * @param {number} previousZoomLevel
	 * @param {number} newZoomLevel
	 * @param {boolean} smooth
	 */
	dispatchZoomEvent(timing, zoomPoint, previousZoomLevel, newZoomLevel, smooth = false) {
		let type;
		switch (timing) {
			case 'before': type = 'before-zoom'; break;
			case 'after': type = 'after-zoom'; break;
			default: throw new Error("Cannot dispatch a zoom event that is neither before nor after zoom");
		}

		this.dispatchEvent(
			new CustomEvent(type, {
				bubbles: true,
				composed: true,
				detail: {
					previousZoomLevel: previousZoomLevel,
					zoomLevel: newZoomLevel,
					zoomCenter: zoomPoint,
					smooth: smooth,
				},
			})
		);
	}


	// #endregion
	// ------------

}

if (!customElements.get('scroll-zoom-block')) customElements.define('scroll-zoom-block', ScrollZoomBlock);



/**
 * @param {number} x - Animation progress (between 0 and 1).
 * @returns {number}
 */
function easeInOutQuad (x) {
	return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2;
}