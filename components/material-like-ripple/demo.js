CSS.registerProperty({
	name: "--anim-progress",
	syntax: "<number>",
	inherits: false,
	initialValue: 0,
});

document.querySelectorAll('.ripple').forEach(e => {
	e.addEventListener('pointerdown', event => {
		const { x, y } = getNormalizedPointerEventCoords.bind(e)(event);
		console.log('click at', x, y)
		e.style.setProperty('--pointer-x', x);
		e.style.setProperty('--pointer-y', y);
	});
})

function getNormalizedPointerEventCoords(pointerEvent) {
	const { scrollX, scrollY } = window;
	const { left, top } = this.getBoundingClientRect();
	const documentX = scrollX + left;
	const documentY = scrollY + top;
	const { pageX, pageY } = pointerEvent;
	return {
		x: pageX - documentX,
		y: pageY - documentY,
	};
}

function getTranslationCoordinates(positionEvent, { initialSize }) {
	const { height, width } = this.getBoundingClientRect();
	const endPoint = {
		x: (width - initialSize) / 2,
		y: (height - initialSize) / 2,
	};

	let startPoint;
	if (startPoint instanceof PointerEvent) {
		startPoint = this.getNormalizedPointerEventCoords(positionEvent);
	} else {
		startPoint = {
			x: width / 2,
			y: height / 2,
		};
	}

	return { startPoint, endPoint };
}

CSS.paintWorklet.addModule('./material-like-ripple.worklet.js');