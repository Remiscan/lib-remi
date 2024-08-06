registerPaint('ripple', class {
	static get contextOptions() { return { alpha: true }; }
	static get inputProperties() {
		return [
			'--pointer-x',
			'--pointer-y',
		];
	}

	determineRippleSize(size) {
		/** Unit: none */
		const softEdgeContainerRatio = .35;

		/** Unit: px */
		const softEdgeMinimumSize = 75;

		/** Unit: none */
		const initialOriginScale = .2;

		/** Unit: px */
		const padding = 10;

		const maxDim = Math.max(size.height, size.width);
		const softEdgeSize = Math.max(
			softEdgeContainerRatio * maxDim,
			softEdgeMinimumSize
		);
		const initialSize = Math.floor(maxDim * initialOriginScale);
		const maxRadius = Math.sqrt(size.width ** 2 + size.height ** 2) + padding;

		return {
			initialSize,
			rippleScale: (maxRadius + softEdgeSize) / initialSize,
			rippleSize: initialSize
		};
	}

	paint(ctx, size, props) {
		const rippleSize = this.determineRippleSize(size);
	}
});