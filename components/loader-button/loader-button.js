const template = document.createElement('template');
template.innerHTML = /*html*/`
	<button part="button" data-state="sleeping">
		<slot></slot>
	</button>
	<div class="dots-container" part="dots-container">
		<div class="dot" data-n="0" style="--n: 0"></div>
		<div class="dot" data-n="1" style="--n: 1"></div>
		<div class="dot" data-n="2" style="--n: 2"></div>
	</div>
	<slot name="success">Success ✅</slot>
	<slot name="failure">Failure ❌</slot>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
	:host {
		display: inline-grid;
		position: relative;
		font-family: system-ui;
		font-weight: 600;

		--button-color: lightgrey;
		color: black;
		--border-radius: 2em;
		--hover-color: rgb(0, 0, 0, .1);
		--active-color: rgb(255, 255, 255, .1);
	}

	@media (prefers-color-scheme: dark) {
		:host {
			--button-color: dimgrey;
			color: white;
			--hover-color: rgb(255, 255, 255, .1);
			--active-color: rgb(0, 0, 0, .1);
		}
	}

	button,
	.dots-container {
		grid-row: 1;
		grid-column: 1;
		display: grid;
		place-items: center;
		border-radius: var(--border-radius);
	}

	button {
		-webkit-appearance: none;
		appearance: none;
		border: none;
		font: inherit;
		color: inherit;
		padding: 0;
		margin: 0;
		outline-offset: 3px;
		background-color: var(--button-color);
		min-height: 2.5rem;
		min-width: calc(3 * 2.5rem);
		padding: .5em 1em;
		box-sizing: border-box;
		line-height: 1em;
		position: relative;
	}

	.dots-container {
		position: absolute;
		top: 0;
		left: 0;
		container-type: size;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-content: center;
		overflow: clip;
		--dot-size: max(34cqi, 100cqb);
	}

	.dot {
		aspect-ratio: 1;
		width: var(--dot-size);
		height: var(--dot-size);
		background-color: var(--button-color);
		border-radius: 50%;
		transform: scale(1.42);
		backface-visibility: hidden;
	}

	button:hover {
		background-image: linear-gradient(var(--hover-color) 0% 100%);
	}

	button:active {
		background-image: linear-gradient(var(--active-color) 0% 100%);
	}

	.text {
		white-space: nowrap;
	}

	slot[name="success"],
	slot[name="failure"] {
		display: none;
	}

	button:is(
		[data-state="sleeping"],
	) + .dots-container {
		display: none;
	}

	button:is(
		[data-state="waking-up"],
		[data-state="working"],
		[data-state="waiting"]
	) {
		opacity: 0;
		pointer-events: none;
	}

	@keyframes bounce {
		0% { transform: translateY(10cqb) scale(.7); }
		100% { transform: translateY(-10cqb) scale(.7); }
	}

	button:is(
		[data-state="waking-up"],
		[data-state="working"],
		[data-state="waiting"]
	) + .dots-container > .dot {
		transform: translateY(10cqb) scale(.7);
	}

	button[data-state="waking-up"] + .dots-container > .dot {
		transition: transform .2s ease-out;
		transition-delay: calc(100ms * var(--n));

		@starting-style {
			transform: scale(1.42);
		}
	}

	button[data-state="working"] + .dots-container > .dot {
		animation: bounce .5s ease;
		animation-delay: calc(500ms + 100ms * var(--n));
		animation-direction: alternate;
		animation-iteration-count: 2;
	}
`);



/*const observer = new ResizeObserver(entries => {
	for (const entry of entries) {
		if (entry.borderBoxSize) {
			const element = entry.target.getRootNode().host;
			element.style.setProperty('--height', `${entry.contentBoxSize[0].blockSize}px`);
		}
	}
});*/



/** @typedef {'sleeping' | 'waking-up' | 'working' | 'waiting' | 'winding-down'} ButtonState */



class LoaderButton extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.shadow.appendChild(template.content.cloneNode(true));
		this.shadow.adoptedStyleSheets = [sheet];
		//this.observedOnce = false;
	}

	/** @type {HTMLButtonElement} */
	get button() {
		const el = this.shadow.querySelector('button');
		if (!el) throw new TypeError('Expecting HTMLButtonElement');
		return el;
	}

	/** @type {HTMLElement} */
	get dotsContainer() {
		const el = this.shadow.querySelector('.dots-container');
		if (!el) throw new TypeError('Expecting HTMLElement');
		return el;
	}

	/** @type {ButtonState} */
	#state = 'sleeping';

	/** @type {ButtonState} */
	get state() {
		return this.#state;
	}

	/** @param {ButtonState} state */
	set state(state) {
		const previousState = this.#state;
		this.#state = state;
		this.button.setAttribute('data-state', state);
		this.dispatchStateChangeEvent(state, previousState);
	}

	wakeUp() {
		this.state = 'waking-up';
	}

	async windDown() {
		this.state = 'winding-down';
		let onSleep;
		await new Promise(resolve => this.addEventListener('state-change', onSleep = event => {
			if (event.detail.state === 'sleeping') resolve();
		}));
		this.removeEventListener('state-change', onSleep);
	}

	/**
	 * @param {ButtonState} state
	 * @param {PreviousState} state
	 */
	dispatchStateChangeEvent(state, previousState) {
		this.dispatchEvent(new CustomEvent('state-change', {
			bubbles: true,
			composed: false,
			detail: {
				state,
				previousState,
			}
		}));
	}

	#transitionEndCount = 0;
	onTransitionEnd(event) {
		//console.log(event);

		this.#transitionEndCount++;
		if (this.state === 'waking-up' && this.#transitionEndCount === 3) {
			this.state = 'working';
			this.#transitionEndCount = 0;
		}
	}
	boundOnTransitionEnd = this.onTransitionEnd.bind(this);

	#animationEndCount = 0;
	onAnimationEnd(event) {
		console.log(event);
		this.#animationEndCount++;
		if (this.state === 'working' && this.#animationEndCount === 3) {
			this.state = 'waiting';
			setTimeout(() => this.state = 'working', 500);
			this.#animationEndCount = 0;
		}
	}
	boundOnAnimationEnd = this.onAnimationEnd.bind(this);

	update(attr, newValue) {
		switch (attr) {
			case 'type': {
				const button = this.shadowRoot.querySelector('button');
				button.type = newValue || 'button';
			} break;

			case 'text': {
				// Placing the text in two elements allows a smoother transition on hover.
				for (const span of [...this.shadowRoot.querySelectorAll('.text')]) {
					span.innerHTML = newValue;
				}
			} break;
		}
	}

	connectedCallback() {
		// Type should be set as "button" if no type is given
		if (!this.getAttribute('type')) this.update('type', 'button');

		const dotsContainer = this.dotsContainer;
		dotsContainer.addEventListener('transitionend', this.boundOnTransitionEnd);
		dotsContainer.addEventListener('animationend', this.boundOnAnimationEnd);

		// Re-calculate size when content changes
		//observer.observe(this.shadowRoot.querySelector('button'));
	}

	disconnectedCallback() {
		//observer.unobserve(this.shadowRoot.querySelector('button'));

		const dotsContainer = this.dotsContainer;
		dotsContainer.removeEventListener('transitionend', this.boundOnTransitionEnd);
		dotsContainer.removeEventListener('animationend', this.boundOnAnimationEnd);
	}

	static get observedAttributes() {
		return ['type', 'text'];
	}

	attributeChangedCallback(attr, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.update(attr, newValue);
	}
}

if (!customElements.get('loader-button')) customElements.define('loader-button', LoaderButton);