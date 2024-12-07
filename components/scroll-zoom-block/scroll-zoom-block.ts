import 'input-slider';
import { Point2D as BasePoint2D } from 'geometry';
import { VelocityTracker2D, InertiaTracker2D } from 'inertia';



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
	<div part="scrollable-container" tabindex="0">
		<div part="scroll-margin-container">
			<div part="content-scale-container">
				<slot></slot>
			</div>
		</div>
	</div>

	<div part="controls">
		<slot name="zoom-out-button">
			<button type="button">−</button>
		</slot>

		<slot name="zoom-range-slider">
			<input-slider orientation="horizontal" min="1" max="100" step="1"></input-slider>
		</slot>

		<slot name="zoom-in-button">
			<button type="button">+</button>
		</slot>
	</div>
`;



// MARK: STYLES
const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
	:host {
		display: grid;
		contain: size;
		container-type: size;
	}

	[part~="scrollable-container"] {
		grid-area: 1 / 1;
		display: block;
		contain: size;
		overflow: scroll;
		scrollbar-width: none;
		touch-action: none;
		user-select: none;
		z-index: 1;
	}

	[part~="scrollable-container"]:active {
		cursor: move;
	}

	[part~="scrollable-container"]:focus-visible {
		outline: 5px auto Highlight;
		outline: 5px auto -webkit-focus-ring-color;
		outline-offset: 4px;
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

	[part~="controls"] {
		grid-area: 1 / 1;
		place-self: start end;
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
		z-index: 2;
		max-width: 100cqw;
	}

	:host(:not([controls])) [part~="controls"] {
		display: none;
	}

	[part~="controls"] button {
		width: 32px;
		height: 32px;
		display: grid;
		place-content: center;
		margin: 8px;
		position: relative;
		font-size: 32px;
		overflow: clip;
		overflow-clip-margin: 10px;
	}

	[part~="controls"] button::before {
		content: '';
		display: block;
		width: 48px;
		height: 48px;
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}

	[part~="controls"] input-slider {
		--inline-size: calc(4 * var(--block-size));
		flex-grow: 1;
	}

	@container (width < 460px) {
		[part~="controls"] {
			width: 100%;
		}
	}

	:host(:not(:focus-within)[controls="when-focused"]) {
		[part~="controls"] {
			opacity: 0;
			pointer-events: none;
		}
	}
`);



// MARK: TYPES

type Alignment = 'start' | 'center' | 'end';
type StartPosition = { x: Alignment; y: Alignment; };
type Size = { inline: number; block: number; };
type PointerID = number;
type ExtPointerDownEvent = PointerEvent & Partial<{ couldBecomeDoubleTap: boolean; becameDoubleTap: boolean; becameDoubleTapDrag: boolean; hasMovedSignificantly: boolean; startScrollPosition: Point2D; }>;
type PinchData = { centerPoint: Point2D; averageRadius: number; };



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
 * - scroll by panning the block,
 * - scroll with arrow keys after getting focus from a keyboard,
 * - zoom with a mouse wheel,
 * TODO zoom with + and - keyboard keys
 * TODO add visible zoom controls (optional, with "controls" attribute)
 * - pinch to zoom,
 * - double click/tap to zoom,
 * - double tap, maintain and pan vertically to zoom.
 * 
 * @attr `initial-position` - One or two values among `start`, `center` (default) and `end`.
 *                          If two values are given, the first value controls the inline axis, the second value controls the block axis.
 *                          If one value is given, it controls both axes.
 * @attr `min-zoom-level` - The minimal zoom level.
 * @attr `max-zom-level` - The maximal zoom level.
 * @attr `initial-zoom-level` - The initial zoom level. By calling `reset()` on the ScrollZoomBlock, it will return to its original zoom level and position.
 * @attr `controls` - Whether to display buttons and slider controls for the zoom.
 * - If `controls=""`, the buttons and slider will always be visible.
 * - If `controls="when-focused"`, the buttons and slider will only be visible when focused.
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


	shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.appendChild(template.content.cloneNode(true));
		this.shadow.adoptedStyleSheets = [sheet];
	}


	connectedCallback() {
		const scrollableContainer = this.scrollableContainer;
		scrollableContainer.addEventListener('pointerdown', this.boundOnPointerDown);
		scrollableContainer.addEventListener('wheel', this.boundOnWheel, { passive: false });
		scrollableContainer.addEventListener('contextmenu', this.boundOnContextMenu);
		this.contentSlot.addEventListener('slotchange', this.boundOnSlotChange);

		// Initialize the zoom level
		// (no need to initialize the scroll position, the ResizeObserver will cause that)
		const initialZoomLevel = this.getAttribute('initial-zoom-level');
		if (initialZoomLevel) {
			this.currentZoomLevel = this.parseZoomLevel(initialZoomLevel);
		}
	}


	disconnectedCallback() {
		const scrollableContainer = this.scrollableContainer;
		scrollableContainer.removeEventListener('pointerdown', this.boundOnPointerDown);
		scrollableContainer.removeEventListener('wheel', this.boundOnWheel);
		scrollableContainer.removeEventListener('contextmenu', this.boundOnContextMenu);
		this.contentSlot.removeEventListener('slotchange', this.boundOnSlotChange);
		this.currentPointersAbortController.abort();
		this.currentPointersAbortController = new AbortController();
	}


	static get observedAttributes() {
		return ['controls'];
	}


	attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null) {
		if (oldValue === newValue) return;

		switch (attr) {
			case 'controls': {
				this.toggleControls(newValue != null);
			} break;
		}
	}


	// MARK: Part getters


	/** Block that is interactive. Gets all the event listeners. */
	get scrollableContainer(): HTMLElement {
		const el = this.shadow.querySelector('[part~="scrollable-container"]');
		if (!(el instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/**  Block that is sized appropriately to add margins on each side of the content, so that is can be moved to each corner of the ScrollZoomBlock. */
	get scrollMarginContainer(): HTMLElement {
		const el = this.shadow.querySelector('[part~="scroll-margin-container"]');
		if (!(el instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/**  Block that is scaled to simulate the zoom. */
	get contentScaleContainer(): HTMLElement {
		const el = this.shadow.querySelector('[part~="content-scale-container"]');
		if (!(el instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/** Slot that contains the content that is going to be manipulated by interacting with the ScrollZoomBlock. */
	get contentSlot(): HTMLSlotElement {
		const el = this.shadow.querySelector('slot');
		if (!el) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/** Zoom-in button slot. */
	get zoomInButtonSlot(): HTMLSlotElement {
		const slot = this.shadow.querySelector('slot[name="zoom-in-button"]');
		if (!(slot instanceof HTMLSlotElement)) throw new TypeError('Expecting HTMLSlotElement');
		return slot;
	}

	/** Zoom-in button. */
	get zoomInButton(): HTMLElement {
		const slot = this.zoomInButtonSlot;
		const el = slot.assignedElements()[0] ?? slot.children[0];
		if (!(el instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/** Zoom-in button slot. */
	get zoomOutButtonSlot(): HTMLSlotElement {
		const slot = this.shadow.querySelector('slot[name="zoom-out-button"]');
		if (!(slot instanceof HTMLSlotElement)) throw new TypeError('Expecting HTMLSlotElement');
		return slot;
	}

	/** Zoom-out button. */
	get zoomOutButton(): HTMLElement {
		const slot = this.zoomOutButtonSlot
		const el = slot.assignedElements()[0] ?? slot.children[0];
		if (!(el instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/** Zoom range slider slot. */
	get zoomRangeSliderSlot(): HTMLSlotElement {
		const slot = this.shadow.querySelector('slot[name="zoom-range-slider"]');
		if (!(slot instanceof HTMLSlotElement)) throw new TypeError('Expecting HTMLSlotElement');
		return slot;
	}

	/** Zoom range slider. */
	get zoomRangeSlider(): HTMLElement {
		const slot = this.zoomRangeSliderSlot;
		const el = slot.assignedElements()[0] ?? slot.children[0];
		if (!(el instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');
		return el;
	}


	// MARK: Position initialisation


	/** When the contentSlot's content changes, observe the new content with the ResizeObserver. */
	onSlotChange(event: Event) {
		const slot = event.target;
		if (!(slot instanceof HTMLSlotElement)) return;

		const assignedElements = slot.assignedElements();
		for (const element of assignedElements) {
			resizeObserver.observe(element);
		}
	}
	boundOnSlotChange = this.onSlotChange.bind(this);


	/** Parses an alignment value. */
	parseAlignment(position: string): Alignment {
		switch (position) {
			case 'start':
			case 'end':
			case 'center':
				return position;
			default:
				return 'center';
		}
	}

	/** Initial position of the content inside the ScrollZoomBlock. */
	get initialPosition(): StartPosition {
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


	/** Initial zoom level of the content inside the ScrollZoomBlock. */
	get initialZoomLevel(): number {
		const initialZoomLevelAttribute = this.getAttribute('initial-zoom-level') ?? '1';
		return this.parseZoomLevel(initialZoomLevelAttribute);
	}


	/** Size of the margins on each side of the content, added to make it scrollable until it reaches each corner of the ScrollZoomBlock. */
	#scrollMargins: Size = {
		inline: 0,
		block: 0,
	};

	/** Size of the content of the ScrollZoomBlock, not taking the zoom into account. */
	#contentSize: Size = {
		inline: 0,
		block: 0,
	}

	/** Size of the ScrollZoomBlock. */
	#size: Size = {
		inline: 0,
		block: 0
	};


	/**
	 * Computes the size of the margins around the content for a given zoom level.
	 * @param zoomLevel - The zoom level for which we want the margin sizes.
	 * @param sectionSize - The size of the ScrollZoomBlock for which we want the margin sizes.
	 * @param contentSize - The size of the content inside the ScrollZoomBlock around which the margins will be.
	 * @returns The computed margins.
	 */
	#computeScrollMargins(
		zoomLevel: number,
		sectionSize: Size = this.#size,
		contentSize: Size = this.#contentSize,
	): Size {
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
	 */
	#applyScrollMargins(
		zoomLevel: number,
		scrollMargins: Size = this.#computeScrollMargins(zoomLevel),
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
	 */
	get isInitialized(): Promise<void> {
		return new Promise((resolve) => {
			if (this.#isInitialized) return resolve();
			this.addEventListener('initialized', () => resolve(), { once: true });
		});
	}


	/**
	 * Applies the required scroll position and margins to fulfill the initial position of the content inside the ScrollZoomBlock.
	 * @param sectionSize - The size of the ScrollZoomBlock.
	 * @param contentSize - The size of the content inside the ScrollZoomBlock (not taking the zoom into account).
	 */
	initializeScrollPosition(
		sectionSize: Size,
		contentSize: Size,
	) {
		const startPosition = this.initialPosition;

		this.#size = sectionSize;
		this.#contentSize = contentSize;

		const zoomLevel = this.initialZoomLevel;
		const scrollMargins = this.#computeScrollMargins(zoomLevel);
		this.#applyScrollMargins(zoomLevel, scrollMargins);

		let scrollPosition = new Point2D();

		if (contentSize.inline < sectionSize.inline) {
			switch (startPosition.x) {
				case 'start':
					scrollPosition.x = scrollMargins.inline;
					break;
				case 'end':
					scrollPosition.x = 0;
					break;
				case 'center':
				default:
					scrollPosition.x = scrollMargins.inline + .5 * (zoomLevel * contentSize.inline - sectionSize.inline);
					break;
			}
		} else {
			switch (startPosition.x) {
				case 'start':
					scrollPosition.x = 0;
					break;
				case 'end':
					scrollPosition.x = 2 * scrollMargins.inline + zoomLevel * contentSize.inline;
					break;
				case 'center':
				default:
					scrollPosition.x = scrollMargins.inline + .5 * (zoomLevel * contentSize.inline - sectionSize.inline);
					break;
			}
		}

		if (contentSize.block < sectionSize.block) {
			switch (startPosition.y) {
				case 'start':
					scrollPosition.y = scrollMargins.block;
					break;
				case 'end':
					scrollPosition.y = 0;
					break;
				case 'center':
				default:
					scrollPosition.y = scrollMargins.block + .5 * (zoomLevel * contentSize.block - sectionSize.block);
					break;
			}
		} else {
			switch (startPosition.y) {
				case 'start':
					scrollPosition.y = 0;
					break;
				case 'end':
					scrollPosition.y = 2 * scrollMargins.block + zoomLevel * contentSize.block;
					break;
				case 'center':
				default:
					scrollPosition.y = scrollMargins.block + .5 * (zoomLevel * contentSize.block - sectionSize.block);
					break;
			}
		}

		scrollPosition = scrollPosition.round();

		this.scrollableContainer.scrollTo({
			left: scrollPosition.x,
			top: scrollPosition.y,
			behavior: 'instant'
		});

		if (this.initialZoomLevel < this.minZoomLevel || this.initialZoomLevel > this.maxZoomLevel) {
			this.currentZoomLevel = this.minZoomLevel;
		}

		this.updateZoomRangeSlider();

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


	/** Updates the zoom range slider value to match the current zoom level. */
	updateZoomRangeSlider() {
		this.isInitialized.then(() => {
			const slider = this.zoomRangeSlider;
			const newSliderValue = this.getZoomRangeSliderValue();
			if ('value' in slider && slider.value != newSliderValue) slider.value = newSliderValue;
		});
	}


	// #endregion
	// ----------------------



	// --------------------
	// #region INTERACTIONS


	/** Timestamp of the last `pointerup` event. */
	lastPointerUpTime = 0;

	/** Last `pointerdown` event. */
	lastPointerDownEvent: ExtPointerDownEvent | undefined = undefined;

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
	 */
	currentPointerDownEvents: Map<PointerID, ExtPointerDownEvent> = new Map();

	/**
	 * Map of the pointers that are currently down and have moved.
	 * - Keys are their pointer IDs.
	 * - Values are their last `pointermove` events.
	 */
	currentPointerMoveEvents: Map<number, PointerEvent> = new Map();

	/** Data of the last "pinch" interaction. */
	lastPinchData: (PinchData & { startZoomLevel: number; }) | null = null;

	/** Whether the `pointermove` event listener is waiting for the next frame. */
	pointermoveDebounce = false;

	/** Whether the `wheel` event is waiting for the next frame. */
	wheelDebounce = false;

	/** AbortController to easily clean up event listeners. */
	currentPointersAbortController = new AbortController();


	/**
	 * Current scroll position of the ScrollZoomBlock.
	 */
	get scrollPosition(): Point2D {
		const scrollableContainer = this.scrollableContainer;
		return new Point2D(scrollableContainer.scrollLeft, scrollableContainer.scrollTop);
	}


	/**
	 * Checks if any pointer in the list was used for a double-tap-pan.
	 * @param pointers - The list of pointers to check.
	 */
	anyPointerWasDoubleTapDrag(pointers: Iterable<ExtPointerDownEvent>): boolean {
		for (const pointer of pointers) {
			if (pointer.becameDoubleTapDrag) return true;
		}
		return false;
	}


	// MARK: pointerdown
	/**
	 * Handles the `pointerdown` events to detect when the user wants to scroll or zoom in a supported way.
	 */
	onPointerDown(downEvent: ExtPointerDownEvent) {
		downEvent.preventDefault();

		const doubleTapPanHappening = this.anyPointerWasDoubleTapDrag(this.currentPointerDownEvents.values());
		if (doubleTapPanHappening) return;

		const scrollableContainer = downEvent.currentTarget;
		if (!(scrollableContainer instanceof HTMLElement)) throw new TypeError('Expecting HTMLElement');

		scrollableContainer.setPointerCapture(downEvent.pointerId);
		this.currentPointerDownEvents.set(downEvent.pointerId, downEvent);

		const pointerDownTime = Date.now();

		// Store on the `downEvent` whether it is a candidate to trigger a double-tap
		downEvent.couldBecomeDoubleTap = this.currentPointerDownEvents.size === 1
			&& typeof this.lastPointerDownEvent !== 'undefined'
			&& !this.lastPointerDownEvent.hasMovedSignificantly
			&& !this.lastPointerDownEvent.becameDoubleTap
			&& (pointerDownTime - this.lastPointerUpTime) < this.maxDoubleTapDelay;
		// Store on the `downEvent` the scroll position when it happened, to be used later during double-tap-pan
		downEvent.startScrollPosition = this.scrollPosition;

		// Compute the useful properties for the "pinch" interaction based on every currently down (and potentially moving) pointer
		// (only when no pointer was a double-tap-pan, to prevent the pinch from interfering with it)
		if (!doubleTapPanHappening) {
			const pinchPointerEvents: Set<PointerEvent> = new Set();
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
		}

		if (this.currentPointerDownEvents.size === 1) {
			const abortSignal = this.currentPointersAbortController.signal;
			this.addEventListener('pointermove', this.boundOnPointerMove, { signal: abortSignal });
			this.addEventListener('pointerup', this.boundOnPointerUp, { signal: abortSignal });
			this.addEventListener('pointercancel', this.boundOnPointerCancel, { signal: abortSignal });
		}
	}
	boundOnPointerDown = this.onPointerDown.bind(this);


	// MARK: pointermove
	/**
	 * Handles the `pointermove` event to determine if the current interaction is a pan, a pinch, or a double-tap-pan.
	 */
	onPointerMove(moveEvent: PointerEvent) {
		const downEvent: ExtPointerDownEvent | undefined = this.currentPointerDownEvents.get(moveEvent.pointerId);
		if (!downEvent) return;

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
			// - if it was a candidate for double-tap, then the interaction is a double-tap-pan
			// - if not, then the interaction is a pan
			case 1:
				if (
					downEvent.couldBecomeDoubleTap
					&& downEvent.pointerType === 'touch'
					&& this.lastPointerDownEvent?.pointerType === 'touch'
				) {
					interaction = 'double-tap-pan';
				}

				// This condition avoids a visual stutter when a new pointer starts moving
				else if (
					this.lastPinchData
					&& this.currentPointerDownEvents.size === this.currentPointerMoveEvents.size
				) {
					interaction = 'pan';
				}
				break;

			// If there a multiple pointers down and moving, then the interaction is a pinch
			default:
				if (
					this.lastPinchData
					&& this.currentPointerDownEvents.size === this.currentPointerMoveEvents.size
					// Don't pinch if a double-tap-pan is happening
					&& !this.anyPointerWasDoubleTapDrag(this.currentPointerDownEvents.values())
				) {
					interaction = 'pinch';
				}
		}

		switch (interaction) {
			// Drag and pinch can be handled the same, since a pan is basically a "moving pinch" with a single pointer
			// - A pan will scroll the content inside the ScrollZoomBlock
			// - A pinch will also zoom
			case 'pan':
			case 'pinch': {
				const numberOfPointers = this.currentPointerMoveEvents.size;

				// Let's compute the center point of all pointers, and the average radius between each of them and the center point.
				// - The center point will be used as the zoom point
				// - The change in average radius will be used as the zoom level
				const { centerPoint, averageRadius } = this.computeCenterAndAverageRadius(this.currentPointerMoveEvents);

				const interactionDetail = interaction === 'pan'
					? {
						point: centerPoint,
					}
					: {
						numberOfPointers: numberOfPointers,
						center: centerPoint,
						radius: averageRadius,
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

				this.scrollableContainer.scrollTo({
					left: scrollPosition.x,
					top: scrollPosition.y,
					behavior: 'instant',
				});

				// Replace the last pinch center point by the current one, so that on next frame, we don't move too much when following its movements
				lastPinchData.centerPoint = centerPoint;

				this.dispatchInteractionEvent('after', interaction, interactionDetail);
			} break;

			// A double-tap-pan will zoom the content, using the center of the ScrollZoomBlock as the zoom point
			case 'double-tap-pan': {
				downEvent.becameDoubleTapDrag = true;

				if (!this.lastPinchData) throw new Error(`Cannot perform ${interaction} interaction because of missing pinch data`);

				// Computes by how much to scale the current zoom level depending on how much the pointer moved vertically
				const deltaY = moveEvent.clientY - downEvent.clientY;
				const sensitivity = .01;
				// We use the pow() function to smooth out the zoom level curve
				const zoomScale = Math.pow(1.5, deltaY * sensitivity);

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
	boundOnPointerMove = this.onPointerMove.bind(this);


	// MARK: pointerup
	/**
	 * Handles the `pointerup` event to determine if a double-tap happened.
	 */
	onPointerUp(upEvent: PointerEvent) {
		const downEvent: ExtPointerDownEvent | undefined = this.currentPointerDownEvents.get(upEvent.pointerId);
		if (!downEvent) return;

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
				const zoomPoint = new Point2D(upEvent.clientX, upEvent.clientY)
					.round();

				const interactionDetail = {
					direction: zoomDirection < 0 ? 'out' : 'in',
					point: zoomPoint,
				};

				this.dispatchInteractionEvent('before', interaction, interactionDetail);

				// If another smooth zoom was already in progress, abort it
				this.lastSmoothZoomAbortController.abort();

				const { promise, abortController } = this.smoothZoom(
					this.getNextZoomLevel(zoomDirection),
					zoomPoint,
				);

				// Even if aborted, wait for the finalization of the previous smooth zoom before starting the new one
				this.lastSmoothZoomPromise
				.then(() => promise)
				.then(() => {
					this.dispatchInteractionEvent('after', interaction, interactionDetail);
				});

				this.lastSmoothZoomPromise = promise;
				this.lastSmoothZoomAbortController = abortController;
			} break;

			default:
				this.dispatchInteractionEvent('before', interaction);
				this.dispatchInteractionEvent('after', interaction);
		}

		this.lastPointerUpTime = now;

		this.onPointerCancel(upEvent);
	}
	boundOnPointerUp = this.onPointerUp.bind(this);


	// MARK: pointercancel
	/**
	 * Handles the `pointercancel` event, and follows a `pointerup` event, to clean up.
	 */
	onPointerCancel(cancelEvent: PointerEvent) {
		const downEvent: ExtPointerDownEvent | undefined = this.currentPointerDownEvents.get(cancelEvent.pointerId);
		if (!downEvent) return;

		this.currentPointerDownEvents.delete(cancelEvent.pointerId);
		this.currentPointerMoveEvents.delete(cancelEvent.pointerId);
		if (this.currentPointerDownEvents.size <= 0) {
			this.lastPinchData = null;
			this.currentPointersAbortController.abort();
			this.currentPointersAbortController = new AbortController();
		} else {
			// We recompute `lastPinchData` without the pointer that was just removed,
			// so that other pointers that are still present can continue their "pinch" interaction
			// without interruption or stutter
			// (only when no pointer was a double-tap-pan, to prevent the pinch from interfering with it)
			if (!this.anyPointerWasDoubleTapDrag(this.currentPointerDownEvents.values())) {
				this.lastPinchData = {
					...this.computeCenterAndAverageRadius(this.currentPointerMoveEvents),
					startZoomLevel: this.currentZoomLevel,
				};
			}
		}

		this.lastPointerDownEvent = downEvent;
	}
	boundOnPointerCancel = this.onPointerCancel.bind(this);


	// MARK: wheel
	/**
	 * Handles the `wheel` event to zoom in or out depending on the wheel's direction.
	 */
	onWheel(event: WheelEvent) {
		event.preventDefault(); // prevents default scroll

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
	 */
	onContextMenu(event: Event) {
		event.preventDefault();
	}
	boundOnContextMenu = this.onContextMenu.bind(this);


	/**
	 * Promise that resolves when a smoothZoom is over.
	 */
	lastSmoothZoomPromise: Promise<boolean> = Promise.resolve(false);

	lastSmoothZoomAbortController: AbortController = new AbortController();


	// MARK: controls click
	/**
	 * Handles clicks on the zoom buttons when the `controls` attribute is set.
	 */
	async onZoomButtonClick(event: Event) {
		const currentTarget = event.currentTarget;
		if (!(currentTarget instanceof HTMLElement)) return;

		// If a previous smooth zoom is still in progress, abort it
		// and wait for its finalization
		const previousZoomWasNotOver = this.smoothZoomInProgress;
		if (previousZoomWasNotOver) {
			this.lastSmoothZoomAbortController.abort();
			await this.lastSmoothZoomPromise;
		}

		/** @type {1 | -1 | 0} */
		let zoomDirection: 1 | -1 | 0 = 0;
		switch (currentTarget.getAttribute('name')) {
			case 'zoom-in-button': zoomDirection = 1; break;
			case 'zoom-out-button': zoomDirection = -1; break;
		}

		if (!zoomDirection) return;

		const { promise, abortController } = this.smoothZoom(this.getNextZoomLevel(zoomDirection));
		this.lastSmoothZoomPromise = promise,
		this.lastSmoothZoomAbortController = abortController;
	}
	boundOnZoomButtonClick = this.onZoomButtonClick.bind(this);


	// MARK: controls slide
	/**
	 * Handles input events from the zoom range slider.
	 */
	async onZoomRangeInput(event: Event) {
		const target = event.target;
		if (!target || !('value' in target)) return;

		// If a previous smooth zoom is still in progress, abort it
		// and wait for its finalization
		this.lastSmoothZoomAbortController.abort();
		await this.lastSmoothZoomPromise;

		const newZoomLevel = this.computeZoomValueFromRangeSlider(Number(target.value));
		if (!newZoomLevel) return;

		this.zoom(newZoomLevel);
	}
	boundOnZoomRangeInput = this.onZoomRangeInput.bind(this);


	// MARK: CustomEvent
	/**
	 * Dispatches an interaction event.
	 * @param timing - Whether the event is dispatched before or after the interaction happens.
	 * @param interaction - The name of the interaction.
	 * @param detail - The detail of the interaction.
	 */
	dispatchInteractionEvent(timing: 'before' | 'after', interaction: string, detail: Record<string, unknown> = {}) {
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


	// MARK: manual controls

	/**
	 * Toggles the manual controls.
	 * @param showControls Whether the manual controls should be shown or not.
	 */
	toggleControls(showControls: boolean) {
		const methodName = showControls ? 'addEventListener' : 'removeEventListener';
		this.zoomInButtonSlot[methodName]('click', this.boundOnZoomButtonClick);
		this.zoomOutButtonSlot[methodName]('click', this.boundOnZoomButtonClick);
		this.zoomRangeSliderSlot[methodName]('input', this.boundOnZoomRangeInput);
	}


	// #endregion
	// ----------------------



	// ------------
	// #region ZOOM


	/** Default minimum zoom level. */
	defaultMinZoomLevel = .25;

	get minZoomLevel(): number {
		return Number(this.getAttribute('min-zoom-level')) || this.defaultMinZoomLevel;
	}

	/** Default maximum zoom level. */
	defaultMaxZoomLevel = 4;

	get maxZoomLevel(): number {
		return Number(this.getAttribute('max-zoom-level')) || this.defaultMaxZoomLevel;
	}

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
	 * @param pointerEvents - The list of pointers.
	 */
	computeCenterAndAverageRadius(pointerEvents: Set<PointerEvent> | Map<any, PointerEvent>): PinchData {
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
	 * @param level - A zoom level, as a number or percentage.
	 * @returns The zoom level, as a number.
	 */
	parseZoomLevel(level: string | number): number {
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
	 * @param zoomLevel
	 */
	clampZoomLevel(zoomLevel: number): number {
		return Math.max(this.minZoomLevel, Math.min(zoomLevel, this.maxZoomLevel));
	}


	/**
	 * Gets the next zoom level for manual controls.
	 * @param direction - Direction of the zoom.
	 */
	getNextZoomLevel(direction: 1 | -1): number {
		return (1.6 ** direction) * this.currentZoomLevel;
	}


	/**
	 * Gets the zoom range slider value that corresponds to the given zoom level.  
	 * The slider takes values in the [1, 100] range and uses its value to determine the zoom level on a logarithmic scale.
	 * So passing the zoom level directly to it is not possible, we need to compute the value.
	 * @param zoomLevel
	 * @param minZoomLevel
	 * @param maxZoomLevel
	 */
	getZoomRangeSliderValue(
		zoomLevel: number = this.currentZoomLevel,
		minZoomLevel: number = this.minZoomLevel,
		maxZoomLevel: number = this.maxZoomLevel,
	): number {
		const numberOfSliderPoints = 100;
		const sliderValue = 1 + (numberOfSliderPoints - 1) * (
			Math.log(zoomLevel / minZoomLevel) / Math.log(maxZoomLevel / minZoomLevel)
		);
		return Math.round(sliderValue);
	}


	/**
	 * Computes the zoom level from the range slider value.
	 * @param sliderValue The current slider value.
	 * @param minZoomLevel
	 * @param maxZoomLevel
	 */
	computeZoomValueFromRangeSlider(
		sliderValue: number,
		minZoomLevel: number = this.minZoomLevel,
		maxZoomLevel: number = this.maxZoomLevel,
	): number {
		const numberOfSliderPoints = 100;
		return minZoomLevel * Math.pow(
			maxZoomLevel / minZoomLevel,
			(sliderValue - 1) / (numberOfSliderPoints - 1)
		);
	}


	/**
	 * Computes the clamped zoom level, scroll margins and scroll position that will be applied after a zoom.
	 * @param zoomLevel - The requested new zoom level.
	 * @param zoomPoint - The point whose position should not change after the zoom.
	 * @param sectionRect - The size and position of the ScrollZoomBlock.
	 * @param oldZoomLevel - The zoom level before applying the new zoom level.
	 * @param oldScrollPosition - The scroll position before applying the new zoom level.
	 * @param oldScrollMargins - The scroll margins before applying the new zoom level.
	 * @param newScrollMargins - The scroll margins after applying the new zoom level.
	 */
	#computeZoom(
		zoomLevel: number,
		zoomPoint: Point2D,
		sectionRect: DOMRect,
		oldZoomLevel: number,
		oldScrollPosition: Point2D,
		oldScrollMargins: Size,
		newScrollMargins: Size | undefined,
	): { zoomLevel: number; newScrollMargins: Size; newScrollPosition: Point2D; } {
		zoomLevel = this.clampZoomLevel(zoomLevel);
		if (!newScrollMargins) newScrollMargins = this.#computeScrollMargins(zoomLevel);

		const contentSizeWithOldZoom = {
			inline: this.#contentSize.inline * oldZoomLevel,
			block: this.#contentSize.block * oldZoomLevel,
		};

		const contentSizeWithNewZoom = {
			inline: this.#contentSize.inline * zoomLevel,
			block: this.#contentSize.block * zoomLevel,
		};

		// Compute the zoomPoint position as a percentage of the content's size before the zoom
		const zoomPointRelativeToSection = zoomPoint
			.translate(-sectionRect.x, -sectionRect.y);
		const zoomPointAsPercentageOfContent = zoomPointRelativeToSection
			.translate(oldScrollPosition.x, oldScrollPosition.y)
			.translate(-oldScrollMargins.inline, -oldScrollMargins.block)
			.scale(1 / contentSizeWithOldZoom.inline, 1 / contentSizeWithOldZoom.block);

		// Compute the new scroll position to keep the zoomPoint after the zoom at the same position as it was before the zoom
		const newScrollPosition = zoomPointAsPercentageOfContent
			.scale(contentSizeWithNewZoom.inline, contentSizeWithNewZoom.block)
			.translate(newScrollMargins.inline, newScrollMargins.block)
			.translate(-zoomPointRelativeToSection.x, -zoomPointRelativeToSection.y)
			.round();

		console.log(newScrollPosition);

		return {
			zoomLevel,
			newScrollMargins,
			newScrollPosition,
		};
	}


	// MARK: instant zoom
	/**
	 * Zooms the ScrollZoomBlock's content in or out.
	 * @param zoomLevel - The requested new zoom level.
	 * @param zoomPoint - The point whose position should not change after the zoom.
	 * @param sectionRect - The size and position of the ScrollZoomBlock.
	 * @param oldZoomLevel - The zoom level before applying the new zoom level.
	 * @param oldScrollPosition - The scroll position before applying the new zoom level.
	 * @param oldScrollMargins - The scroll margins before applying the new zoom level.
	 * @param dispatchEvents - Whether zoom events should be dispatched or not.
	 * @param forcedNewScrollMargins - The scroll margins after applying the new zoom level.
	 */
	zoom(
		zoomLevel: number,
		zoomPoint?: Point2D,
		sectionRect: DOMRect = this.getBoundingClientRect(),
		oldZoomLevel: number = this.currentZoomLevel,
		oldScrollPosition: Point2D = this.scrollPosition,
		oldScrollMargins: Size = this.#scrollMargins,
		dispatchEvents: boolean = true,
		forcedNewScrollMargins?: Size,
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
			oldScrollMargins,
			forcedNewScrollMargins,
		)

		if (dispatchEvents) this.dispatchZoomEvent('before', zoomPoint, oldZoomLevel, clampedZoomLevel);

		// We apply the new zoom level
		this.contentScaleContainer?.style.setProperty('--zoom-level', clampedZoomLevel.toFixed(8));
		this.#currentZoomLevel = clampedZoomLevel;
		this.updateZoomRangeSlider();

		// We resize the scroll margins container to allow the content inside the ScrollZoomBlock
		// to be scrolled towards each corner of the ScrollZoomBlock when it's smaller than it
		this.#applyScrollMargins(clampedZoomLevel, newScrollMargins);

		// We scroll to keep the `zoomPoint` fixed
		this.scrollableContainer.scrollTo({
			left: newScrollPosition.x,
			top: newScrollPosition.y,
			behavior: 'instant',
		});

		if (dispatchEvents) this.dispatchZoomEvent('after', zoomPoint, oldZoomLevel, clampedZoomLevel);
	}


	// MARK: smooth zoom

	/** Whether a smooth zoom is in progress. */
	smoothZoomInProgress: boolean = false;

	/**
	 * Smoothly animates the zoom of the ScrollZoomBlock's content.  
	 * TODO When Scoped Element Transitions exist, use one here instead of calling zoom() many times.
	 * @param zoomLevel - The requested new zoom level.
	 * @param zoomPoint - The point whose position should not change after the zoom.
	 * @param zoomDuration - The duration of the smooth zoom animation.
	 * @param sectionRect - The size and position of the ScrollZoomBlock.
	 * @param oldZoomLevel - The zoom level before applying the new zoom level.
	 * @param oldScrollPosition - The scroll position before applying the new zoom level.
	 * @param oldScrollMargins - The scroll margins before applying the new zoom level.
	 * @returns A promise that resolves when the smooth zoom ends, and an AbortController that skips the animation when aborted.
	 */
	smoothZoom(
		zoomLevel: number,
		zoomPoint?: Point2D,
		zoomDuration: number = 200, // ms
		sectionRect: DOMRect = this.getBoundingClientRect(),
		oldZoomLevel: number = this.currentZoomLevel,
		oldScrollPosition: Point2D = this.scrollPosition,
		oldScrollMargins: Size = this.#scrollMargins,
	): { promise: Promise<boolean>; abortController: AbortController; } {
		this.smoothZoomInProgress = true;

		// If no zoom point is defined, use the center of the ScrollZoomBlock
		if (typeof zoomPoint === 'undefined') {
			zoomPoint = new Point2D(
				sectionRect.x + sectionRect.width / 2,
				sectionRect.y + sectionRect.height / 2,
			);
		}

		const startTime = Date.now();
		zoomLevel = this.clampZoomLevel(zoomLevel);

		const newScrollMargins = this.#computeScrollMargins(zoomLevel);
		/** @type {Size} */
		const tempScrollMargins: Size = {
			inline: Math.max(oldScrollMargins.inline, newScrollMargins.inline),
			block: Math.max(oldScrollMargins.block, newScrollMargins.block),
		}

		this.dispatchZoomEvent('before', zoomPoint, oldZoomLevel, zoomLevel, 'smooth');

		const startZoomLevel = oldZoomLevel;
		let now = Date.now();

		const abortController = new AbortController();

		/** @type {Promise<boolean>} */
		const promise: Promise<boolean> = new Promise(async (resolve) => {
			while (now - startTime < zoomDuration) {
				// Use an easing function around the time parameter to ease in and out of the animation
				const tempZoomLevel = startZoomLevel + (zoomLevel - startZoomLevel) * easeInOutQuad((now - startTime) / zoomDuration);
	
				// Passing the startZoomLevel and the oldScrollPosition to the zoom() function
				// avoids an increasing shift in the scroll position as we progressively zoom
				this.zoom(tempZoomLevel, zoomPoint, sectionRect, oldZoomLevel, oldScrollPosition, oldScrollMargins, false, tempScrollMargins);
	
				await new Promise(res => requestAnimationFrame(res));
				now = Date.now();

				if (abortController.signal.aborted) break;
			}
	
			// Zoom one last time after the animation to make sure the final zoom level was reached
			this.zoom(zoomLevel, zoomPoint, sectionRect, oldZoomLevel, oldScrollPosition, oldScrollMargins, false);
	
			this.dispatchZoomEvent('after', zoomPoint, oldZoomLevel, zoomLevel, 'smooth');
			resolve(this.smoothZoomInProgress = false);
		});
		
		return { promise, abortController };
	}


	// MARK: CustomEvent
	/**
	 * Dispatches a zoom event.
	 * @param timing - Whether the event is dispatched before or after the interaction happens.
	 * @param zoomPoint - The point that stayed fixed during the zoom.
	 * @param previousZoomLevel - The previous zoom level.
	 * @param newZoomLevel - The current zoom level.
	 * @param behavior - Whether the zoom happened instantly or was smoothly animated.
	 */
	dispatchZoomEvent(
		timing: 'before' | 'after' | 'cancel',
		zoomPoint: Point2D,
		previousZoomLevel: number,
		newZoomLevel: number,
		behavior: 'smooth' | 'instant' = 'instant',
	) {
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
 * @param x - Animation progress (between 0 and 1).
 */
function easeInOutQuad (x: number): number {
	return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2;
}