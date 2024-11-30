const scrollZoomBlock = document.querySelector('scroll-zoom-block');
const logContainer = document.querySelector('.log');
logContainer.classList.add('on');

function formatInteractionDetail(eventDetail) {
	const prefix = `<em>Last interaction</em>`;
	let detail = 'waiting...';
	if (eventDetail) {
		detail = `[${eventDetail.interaction}] `;
		detail += Object.entries(eventDetail)
			.filter(([key, value]) => key !== 'interaction')
			.map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
			.join(' , ');
	}
	return `${prefix} ${detail}`;
}

logContainer.innerHTML = formatInteractionDetail('');

scrollZoomBlock.addEventListener('before-interaction', event => {
	logContainer.innerHTML = formatInteractionDetail(event.detail);
});