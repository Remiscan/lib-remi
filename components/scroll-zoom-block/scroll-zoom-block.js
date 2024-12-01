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
	<div part="scroll-margin-container">
		<div part="content-scale-container">
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

	[part~="scroll-margin-container"] {
		display: grid;
		place-content: center;
		inline-size: var(--inline-size, 100%);
		block-size: var(--block-size, 100%);
	}

	[part~="content-scale-container"] {
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
/** @typedef {number} PointerID */
/** @typedef { PointerEvent & Partial<{ couldBecomeDoubleTap: boolean, becameDoubleTap: boolean, hasMovedSignificantly: boolean, startScrollPosition: Point2D }> } ExtPointerDownEvent */
/** @typedef {{ centerPoint: Point2D, averageRadius: number }} PinchData */



// MARK: OBSERVER
/**
 * Initializes the scroll position of a ScrollZoomBlock when it changes size (only on intrinsic size changes, not on zoom changes).
 */
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



/**
 * Block is interactive in the following ways:
 * - scroll by dragging the block,
 * - zoom with a mouse wheel,
 * - pinch to zoom,
 * - double click/tap to zoom,
 * - double tap, maintain and drag vertically to zoom.
 * 
 * @attr `initial-position` - One or two values among `start`, `center` (default) and `end`.
 *                          If two values are given, the first value controls the inline axis, the second value controls the block axis.
 *                          If one value is given, it controls both axes.
 * @attr `min-zoom-level` - The minimal zoom level.
 * @attr `max-zom-level` - The maximal zoom level.
 * @attr `initial-zoom-level` - The initial zoom level. By calling `reset()` on the ScrollZoomBlock, it will return to its original zoom level and position.
 * 
 * @fires [] before-interaction - Event dispatched before an interaction's effects are applied.
 * @fires [] after-interaction - Event dispatched after an interaction's effects have been applied.
 * @fires [] before-zoom - Event dispatched before a zoom is applied.
 * @fires [] after-zoom - Event dispatched after a zoom has been applied.
 */
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

		// Initialize the zoom level
		// (no need to initialize the scroll position, the ResizeObserver will cause that)
		const initialZoomLevel = this.getAttribute('initial-zoom-level');
		if (initialZoomLevel) {
			this.currentZoomLevel = this.parseZoomLevel(initialZoomLevel);
		}
	}


	disconnectedCallback() {
		this.removeEventListener('pointerdown', this.boundOnPointerDown);
		this.removeEventListener('wheel', this.boundOnWheel);
		this.removeEventListener('contextmenu', this.boundOnContextMenu);
		this.contentSlot?.removeEventListener('slotchange', this.boundOnSlotChange);
		this.disconnectAllTemporaryEventListeners();
	}


	static get observedAttributes() {
		return ['min-zoom-level', 'max-zoom-level'];
	}


	/**
	 * @param {string} attr
	 * @param {string | null} oldValue
	 * @param {string | null} newValue
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
		}
	}


	// MARK: Part getters


	/**
	 * Block that is sized appropriately to add margins on each side of the content, so that is can be moved to each corner of the ScrollZoomBlock.
	 * @returns {HTMLElement | null}
	 */
	get scrollMarginContainer() {
		return this.shadow.querySelector('[part~="scroll-margin-container"]');
	}

	/**
	 * Block that is scaled to simulate the zoom.
	 * @returns {HTMLElement | null}
	 */
	get contentScaleContainer() {
		return this.shadow.querySelector('[part~="content-scale-container"]');
	}

	/**
	 * Slot that contains the content that is going to be manipulated by interacting with the ScrollZoomBlock.
	 * @returns {HTMLSlotElement | null}
	 */
	get contentSlot() {
		return this.shadow.querySelector('slot');
	}


	// MARK: Position initialisation


	/**
	 * When the contentSlot's content changes, observe the new content with the ResizeObserver.
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
	 * Parses an alignment value.
	 * @param {string} position
	 * @returns {Alignment}
	 */
	parseAlignment(position) {
		switch (position) {
			case 'start':
			case 'end':
			case 'center':
				return position;
			default:
				return 'center';
		}
	}

	/**
	 * Initial position of the content inside the ScrollZoomBlock.
	 * @returns {StartPosition}
	 */
	get initialPosition() {
		const startPositionAttribute = this.getAttribute('initial-position') ?? '';
		const parts = startPositionAttribute.split(' ').filter(v => v);

		let startPositionX, startPositionY;
		if (parts.length === 2) {
			startPositionX = this.parseAlignment(parts[0]);
			startPositionY = this.parseAlignment(parts[1]);
		}
		else {
			startPositionX = this.parseAlignment(parts[0]);
			startPositionY = startPositionX;
		}

		return {
			x: startPositionX,
			y: startPositionY
		};
	}


	/**
	 * Initial zoom level of the content inside the ScrollZoomBlock.
	 * @returns {number}
	 */
	get initialZoomLevel() {
		const initialZoomLevelAttribute = this.getAttribute('initial-zoom-level') ?? '1';
		return this.parseZoomLevel(initialZoomLevelAttribute);
	}


	/**
	 * Size of the margins on each side of the content, added to make it scrollable until it reaches each corner of the ScrollZoomBlock.
	 * @type {Size}
	 */
	#scrollMargins = {
		inline: 0,
		block: 0,
	};

	/**
	 * Size of the content of the ScrollZoomBlock, not taking the zoom into account.
	 * @type {Size}
	 */
	#contentSize = {
		inline: 0,
		block: 0,
	}

	/**
	 * Size of the ScrollZoomBlock.
	 * @type {Size}
	 */
	#size = {
		inline: 0,
		block: 0
	};


	/**
	 * Computes the size of the margins around the content for a given zoom level.
	 * @param {number} zoomLevel - The zoom level for which we want the margin sizes.
	 * @param {Size} sectionSize - The size of the ScrollZoomBlock for which we want the margin sizes.
	 * @param {Size} contentSize - The size of the content inside the ScrollZoomBlock around which the margins will be.
	 * @returns {Size} The computed margins.
	 */
	#computeScrollMargins(
		zoomLevel,
		sectionSize = this.#size,
		contentSize = this.#contentSize,
	) {
		// On utilise `Math.floor` car on veut que la marge soit permette **au maximum** de scroller le contenu jusqu'au bord.
		// Avec `round` ou `ceil`, la marge pourrait être 1px plus grande, donc permettre de scroller 1px plus loin, donc faire overflow le contenu de 1px.
		const marginInline = Math.max(0, Math.floor(sectionSize.inline - contentSize.inline * zoomLevel));
		const marginBlock = Math.max(0, Math.floor(sectionSize.block - contentSize.block * zoomLevel));

		return {
			inline: marginInline,
			block: marginBlock,
		};
	}


	/**
	 * Applies the computed margins around the content of the ScrollZoomBlock.
	 * @param {number} zoomLevel
	 * @param {Size} scrollMargins
	 */
	#applyScrollMargins(
		zoomLevel,
		scrollMargins = this.#computeScrollMargins(zoomLevel),
	) {
		const scrollMarginContainer = this.scrollMarginContainer;
		if (!scrollMarginContainer) throw new TypeError('Expecting HTMLElement');
		scrollMarginContainer.style.setProperty('--inline-size', `${Math.ceil(this.#contentSize.inline * zoomLevel + 2 * scrollMargins.inline)}px`);
		scrollMarginContainer.style.setProperty('--block-size', `${Math.ceil(this.#contentSize.block * zoomLevel + 2 * scrollMargins.block)}px`);
		this.#scrollMargins = scrollMargins;
	}


	/** Whether the initial position and zoom have been applied. */
	#isInitialized = false;

	/**
	 * Promise that gets resolved when the initial position and zoom have been applied.
	 * @returns {Promise<void>}
	 */
	get isInitialized() {
		return new Promise((resolve) => {
			if (this.#isInitialized) return resolve();
			this.addEventListener('initialized', () => resolve(), { once: true });
		});
	}


	/**
	 * Applies the required scroll position and margins to fulfill the initial position of the content inside the ScrollZoomBlock.
	 * @param {Size} sectionSize - The size of the ScrollZoomBlock.
	 * @param {Size} contentSize - The size of the content inside the ScrollZoomBlock (not taking the zoom into account).
	 */
	initializeScrollPosition(
		sectionSize,
		contentSize,
	) {
		const startPosition = this.initialPosition;

		this.#size = sectionSize;
		this.#contentSize = contentSize;

		const zoomLevel = this.initialZoomLevel;
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

		this.scrollTo({
			left: scrollLeft,
			top: scrollTop,
			behavior: 'instant'
		});

		this.#isInitialized = true;
		this.dispatchEvent(new Event('initialized'));
	}


	/**
	 * Restores the initial zoom level and scroll position.
	 * TODO fix incorrect scroll position
	 */
	reset() {
		this.currentZoomLevel = this.initialZoomLevel;
		this.initializeScrollPosition(this.#size, this.#contentSize);
	}


	// #endregion
	// ----------------------



	// --------------------
	// #region INTERACTIONS


	/** Timestamp of the last `pointerup` event. */
	lastPointerUpTime = 0;

	/**
	 * Last `pointerdown` event.
	 * @type {ExtPointerDownEvent | undefined}
	 */
	lastPointerDownEvent = undefined;

	/** Number of `pointerup` events since the last double-tap. */
	pointerUpsCount = 0;

	/** Reference of the timeout after which the `pointerUpsCount` is reset to zero. */
	pointerUpTimeout = -1;

	/** Max delay between two successive `pointerup` events for them to trigger a double-tap. */
	maxDoubleTapDelay = 500; // ms

	/**
	 * Max number of pixels a pointer needs to move (from its initial position) for the move to be considered significant.
	 * Enables us to ignore non-significant "moves" detected when a coarse pointer is not moving.
	 */
	minMoveThreshold = 10; // px

	/**
	 * Map of the pointers that are currently down.
	 * - Keys are their pointer IDs.
	 * - Values are their `pointerdown` events with added properties.
	 * @type {Map<PointerID, ExtPointerDownEvent>}
	 */
	currentPointerDownEvents = new Map();

	/**
	 * Map of the pointers that are currently down and have moved.
	 * - Keys are their pointer IDs.
	 * - Values are their last `pointermove` events.
	 * @type {Map<number, PointerEvent>}
	 */
	currentPointerMoveEvents = new Map();

	/**
	 * Data of the last "pinch" interaction.
	 * @type {(PinchData & { startZoomLevel: number }) | null}
	 */
	lastPinchData = null;

	/** Whether the `pointermove` event listener is waiting for the next frame. */
	pointermoveDebounce = false;

	/** Whether the `wheel` event is waiting for the next frame. */
	wheelDebounce = false;


	/**
	 * Current scroll position of the ScrollZoomBlock.
	 * @returns {Point2D}
	 */
	get scrollPosition() {
		return new Point2D(this.scrollLeft, this.scrollTop);
	}


	// MARK: pointerdown
	/**
	 * Handles the `pointerdown` events to detect when the user wants to scroll or zoom in a supported way.
	 * @param {ExtPointerDownEvent} downEvent
	 */
	onPointerDown(downEvent) {
		downEvent.preventDefault();

		this.setPointerCapture(downEvent.pointerId);
		this.currentPointerDownEvents.set(downEvent.pointerId, downEvent);

		// Prepare an AbortController to easily remove all event listeners on the pointer later
		const abortController = new AbortController();
		this.currentPointersAbortControllers.set(downEvent.pointerId, abortController);

		const pointerDownTime = Date.now();

		// Store on the `downEvent` whether it is a candidate to trigger a double-tap
		downEvent.couldBecomeDoubleTap = this.currentPointerDownEvents.size === 1
			&& typeof this.lastPointerDownEvent !== 'undefined'
			&& !this.lastPointerDownEvent.hasMovedSignificantly
			&& !this.lastPointerDownEvent.becameDoubleTap
			&& (pointerDownTime - this.lastPointerUpTime) < this.maxDoubleTapDelay;
		// Store on the `downEvent` the scroll position when it happened, to be used later during double-tap-drag
		downEvent.startScrollPosition = this.scrollPosition;

		// Compute the useful properties for the "pinch" interaction based on every currently down (and potentially moving) pointer
		/** @type {Set<PointerEvent>} */
		const pinchPointerEvents = new Set();
		for (const [pointerId, evt] of this.currentPointerDownEvents.entries()) {
			// If the pointer has moved, use its last `pointermove` event to compute the useful properties
			const mvEvt = this.currentPointerMoveEvents.get(pointerId);
			if (mvEvt) pinchPointerEvents.add(mvEvt);
			// If not, use its `pointerdown` event
			else pinchPointerEvents.add(evt);
		}
		this.lastPinchData = {
			...this.computeCenterAndAverageRadius(pinchPointerEvents),
			startZoomLevel: this.currentZoomLevel,
		};

		/** @param {PointerEvent} moveEvent */
		const onPointerMove = (moveEvent) => this.onPointerMove.bind(this)(moveEvent, downEvent);
		/** @param {PointerEvent} upEvent */
		const onPointerUp = (upEvent) => this.onPointerUp.bind(this)(upEvent, downEvent);
		/** @param {PointerEvent} cancelEvent */
		const onPointerCancel = (cancelEvent) => this.onPointerCancel.bind(this)(cancelEvent, downEvent);

		const abortSignal = abortController.signal;
		this.addEventListener('pointermove', onPointerMove, { signal: abortSignal });
		this.addEventListener('pointerup', onPointerUp, { signal: abortSignal });
		this.addEventListener('pointercancel', onPointerCancel, { signal: abortSignal });
	}
	boundOnPointerDown = this.onPointerDown.bind(this);


	// MARK: pointermove
	/**
	 * Handles the `pointermove` event to determine if the current interaction is a drag, a pinch, or a double-tap-drag.
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

		// Let's compute the distance the pointer has moved, to determine whether the move was significant or not
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

			// If there is a single pointer down and moving :
			// - if it was a candidate for double-tap, then the interaction is a double-tap-drag
			// - if not, then the interaction is a drag
			case 1:
				if (
					downEvent.couldBecomeDoubleTap
					&& downEvent.pointerType === 'touch'
					&& this.lastPointerDownEvent?.pointerType === 'touch'
				) {
					interaction = 'double-tap-drag';
				}

				// This condition avoids a visual stutter when a new pointer starts moving
				else if (
					this.lastPinchData
					&& this.currentPointerDownEvents.size === this.currentPointerMoveEvents.size
				) {
					interaction = 'drag';
				}
				break;

			// If there a multiple pointers down and moving, then the interaction is a pinch
			default:
				if (
					this.lastPinchData
					&& this.currentPointerDownEvents.size === this.currentPointerMoveEvents.size
				) {
					interaction = 'pinch';
				}
		}

		switch (interaction) {
			// Drag and pinch can be handled the same, since a drag is basically a "moving pinch" with a single pointer
			// - A drag will scroll the content inside the ScrollZoomBlock
			// - A pinch will also zoom
			case 'drag':
			case 'pinch': {
				const numberOfPointers = this.currentPointerMoveEvents.size;

				// Let's compute the center point of all pointers, and the average radius between each of them and the center point.
				// - The center point will be used as the zoom point
				// - The change in average radius will be used as the zoom level
				const { centerPoint, averageRadius } = this.computeCenterAndAverageRadius(this.currentPointerMoveEvents);

				const interactionDetail = interaction === 'drag'
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
				if (!lastPinchData) throw new Error(`Cannot perform ${interaction} interaction because of missing pinch data`);

				// Only zoom during pinch interactions (when there are multiple pointers)
				if (numberOfPointers > 1) {
					const radiusRatio = averageRadius / lastPinchData.averageRadius;
					if (Number.isFinite(radiusRatio)) {
						const zoomLevel = lastPinchData.startZoomLevel * radiusRatio;
						this.zoom(zoomLevel, centerPoint);
					}
				}

				// Follow the movements of the pinch center,
				// i.e. scroll if all fingers move in a similar direction
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

				// Replace the last pinch center point by the current one, so that on next frame, we don't move too much when following its movements
				lastPinchData.centerPoint = centerPoint;

				this.dispatchInteractionEvent('after', interaction, interactionDetail);
			} break;

			// A double-tap-drag will zoom the content, using the center of the ScrollZoomBlock as the zoom point
			case 'double-tap-drag': {
				if (!this.lastPinchData) throw new Error('impossible');

				// Computes by how much to scale the current zoom level depending on how much the pointer moved vertically
				const deltaY = moveEvent.clientY - downEvent.clientY;
				const sensitivity = .01;
				// We use the exp() function to smooth out the zoom level curve
				const zoomScale = Math.exp((moveEvent.clientY - downEvent.clientY) * sensitivity);

				const interactionDetail = {
					deltaY: deltaY,
				};

				this.dispatchInteractionEvent('before', interaction, interactionDetail);

				// Passing the startZoomLevel and the startScrollPosition to the zoom() function
				// avoids an increasing shift in the scroll position as we progressively zoom
				this.zoom(
					this.lastPinchData.startZoomLevel * zoomScale,
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
	 * Handles the `pointerup` event to determine if a double-tap happened.
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
				interaction = 'double-tap';
			}
		}

		switch (interaction) {
			// In case of double-tap, smoothly zoom
			case 'double-tap': {
				downEvent.becameDoubleTap = true;

				// If the pointer is a mouse pointer and was using the right-click button, then we zoom out.
				// Else we zoom in.
				const zoomDirection = upEvent.button === 2 ? -1 : 1;
				const zoomPoint = new Point2D(
					Math.round(upEvent.clientX),
					Math.round(upEvent.clientY),
				);

				const interactionDetail = {
					direction: zoomDirection < 0 ? 'out' : 'in',
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
	 * Handles the `pointercancel` event, and follows a `pointerup` event, to clean up.
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
			// We recompute `lastPinchData` without the pointer that was just removed,
			// so that other pointers that are still present can continue their "pinch" interaction
			// without interruption or stutter
			this.lastPinchData = {
				...this.computeCenterAndAverageRadius(this.currentPointerMoveEvents),
				startZoomLevel: this.currentZoomLevel,
			};
		}

		this.lastPointerDownEvent = downEvent;
	}


	// MARK: wheel
	/**
	 * Handles the `wheel` event to zoom in or out depending on the wheel's direction.
	 * @param {WheelEvent} event
	 */
	onWheel(event) {
		if (this.wheelDebounce) return;
		this.wheelDebounce = true;

		const interaction = 'wheel';

		const zoomRatio = 1 - .1 * Math.sign(event.deltaY);

		const interactionDetail = {
			direction: Math.sign(event.deltaY) < 0 ? 'up' : 'down',
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
	 * Prevents the context menu, in order not to interfere with the double-tap interaction.
	 * @param {Event} event
	 */
	onContextMenu(event) {
		event.preventDefault();
	}
	boundOnContextMenu = this.onContextMenu.bind(this);


	// MARK: CustomEvent
	/**
	 * Dispatches an interaction event.
	 * @param {'before'|'after'} timing - Whether the event is dispatched before or after the interaction happens.
	 * @param {string} interaction - The name of the interaction.
	 * @param {Record<string, unknown>} detail - The detail of the interaction.
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
	 * Stores an AbortController for each pointer, to easily clean up its event listeners.
	 * @type {Map<number, AbortController>}
	 */
	currentPointersAbortControllers = new Map();

	/** Removes all event listeners on all pointers. */
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


	/** Default minimum zoom level. */
	defaultMinZoomLevel = .25;
	/** Current minimum zoom level. */
	minZoomLevel = this.defaultMinZoomLevel;

	/** Default maximum zoom level. */
	defaultMaxZoomLevel = 4;
	/** Current maximum zoom level. */
	maxZoomLevel = this.defaultMaxZoomLevel;

	/** Currently applied zoom level. */
	#currentZoomLevel = 1;

	/** Currently applied zoom level. */
	get currentZoomLevel() {
		return this.#currentZoomLevel;
	}

	set currentZoomLevel(zoomLevel) {
		this.isInitialized.then(
			() => this.zoom(zoomLevel)
		);
	}


	/**
	 * Computes the center of a list of pointers, and the average length between each pointer and that center.
	 * @param {Set<PointerEvent> | Map<any, PointerEvent>} pointerEvents - The list of pointers.
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
			// We round the coordinates only after the radius was computed, in order not to reduce the precision of its computation
			centerPoint: centerPoint.round(),
			averageRadius: radiusTotal / numberOfEvents,
		};
	}


	/**
	 * Parses a number or percentage as a zoom level.
	 * @param {string | number} level - A zoom level, as a number or percentage.
	 * @returns {number} - The zoom level, as a number.
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
	 * Clamps a zoom level between the minimum and maximum zoom levels of the ScrollZoomBlock.
	 * @param {number} zoomLevel
	 * @returns {number}
	 */
	clampZoomLevel(zoomLevel) {
		return Math.max(this.minZoomLevel, Math.min(zoomLevel, this.maxZoomLevel));
	}


	/**
	 * Computes the clamped zoom level, scroll margins and scroll position that will be applied after a zoom.
	 * @param {number} zoomLevel - The requested new zoom level.
	 * @param {Point2D} zoomPoint - The point whose position should not change after the zoom.
	 * @param {DOMRect} sectionRect - The size and position of the ScrollZoomBlock.
	 * @param {number} oldZoomLevel - The zoom level before applying the new zoom level.
	 * @param {Point2D} oldScrollPosition - The scroll position before applying the new zoom level.
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
	 * Zooms the ScrollZoomBlock's content in or out.
	 * @param {number} zoomLevel - The requested new zoom level.
	 * @param {Point2D=} zoomPoint - The point whose position should not change after the zoom.
	 * @param {DOMRect} sectionRect - The size and position of the ScrollZoomBlock.
	 * @param {number} oldZoomLevel - The zoom level before applying the new zoom level.
	 * @param {Point2D} oldScrollPosition - The scroll position before applying the new zoom level.
	 * @param {boolean} dispatchEvents - Whether zoom events should be dispatched or not.
	 */
	zoom(
		zoomLevel,
		zoomPoint,
		sectionRect = this.getBoundingClientRect(),
		oldZoomLevel = this.currentZoomLevel,
		oldScrollPosition = new Point2D(this.scrollLeft, this.scrollTop),
		dispatchEvents = true,
	) {
		// If no zoom point is defined, use the center of the ScrollZoomBlock
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

		// We apply the new zoom level
		this.contentScaleContainer?.style.setProperty('--zoom-level', clampedZoomLevel.toFixed(8));
		this.#currentZoomLevel = clampedZoomLevel;

		// We resize the scroll margins container to allow the content inside the ScrollZoomBlock
		// to be scrolled towards each corner of the ScrollZoomBlock when it's smaller than it
		this.#applyScrollMargins(clampedZoomLevel, newScrollMargins);

		// We scroll to keep the `zoomPoint` fixed
		this.scrollTo({
			left: newScrollPosition.x,
			top: newScrollPosition.y,
			behavior: 'instant',
		});

		if (dispatchEvents) this.dispatchZoomEvent('after', zoomPoint, oldZoomLevel, clampedZoomLevel);
	}


	// MARK: smooth zoom
	/**
	 * Smoothly animates the zoom of the ScrollZoomBlock's content.  
	 * TODO When Scoped Element Transitions exist, use one here instead of calling zoom() many times.
	 * @param {number} zoomLevel - The requested new zoom level.
	 * @param {Point2D=} zoomPoint - The point whose position should not change after the zoom.
	 * @param {number} zoomDuration - The duration of the smooth zoom animation.
	 * @param {DOMRect} sectionRect - The size and position of the ScrollZoomBlock.
	 * @param {number} oldZoomLevel - The zoom level before applying the new zoom level.
	 * @param {Point2D} oldScrollPosition - The scroll position before applying the new zoom level.
	 */
	async smoothZoom(
		zoomLevel,
		zoomPoint,
		zoomDuration = 300, // ms
		sectionRect = this.getBoundingClientRect(),
		oldZoomLevel = this.currentZoomLevel,
		oldScrollPosition = new Point2D(this.scrollLeft, this.scrollTop),
	) {
		// If no zoom point is defined, use the center of the ScrollZoomBlock
		if (typeof zoomPoint === 'undefined') {
			zoomPoint = new Point2D(
				sectionRect.x + sectionRect.width / 2,
				sectionRect.y + sectionRect.height / 2,
			);
		}

		const startTime = Date.now();
		zoomLevel = this.clampZoomLevel(zoomLevel);

		this.dispatchZoomEvent('before', zoomPoint, oldZoomLevel, zoomLevel, 'smooth');

		const startZoomLevel = this.currentZoomLevel;
		let now = Date.now();
		while (now - startTime < zoomDuration) {
			// Use an easing function around the time parameter to ease in and out of the animation
			const tempZoomLevel = startZoomLevel + (zoomLevel - startZoomLevel) * easeInOutQuad((now - startTime) / zoomDuration);

			// Passing the startZoomLevel and the oldScrollPosition to the zoom() function
			// avoids an increasing shift in the scroll position as we progressively zoom
			this.zoom(tempZoomLevel, zoomPoint, sectionRect, oldZoomLevel, oldScrollPosition, false);

			await new Promise(resolve => requestAnimationFrame(resolve));
			now = Date.now();
		}

		// Zoom one last time after the animation to make sure the final zoom level was reached
		this.zoom(zoomLevel, zoomPoint, sectionRect, oldZoomLevel, oldScrollPosition, false);

		this.dispatchZoomEvent('after', zoomPoint, oldZoomLevel, zoomLevel, 'smooth');
	}


	// MARK: CustomEvent
	/**
	 * Dispatches a zoom event.
	 * @param {'before' | 'after'} timing - Whether the event is dispatched before or after the interaction happens.
	 * @param {Point2D} zoomPoint - The point that stayed fixed during the zoom.
	 * @param {number} previousZoomLevel - The previous zoom level.
	 * @param {number} newZoomLevel - The current zoom level.
	 * @param {'smooth' | 'instant'} behavior - Whether the zoom happened instantly or was smoothly animated.
	 */
	dispatchZoomEvent(timing, zoomPoint, previousZoomLevel, newZoomLevel, behavior = 'instant') {
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
					behavior,
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