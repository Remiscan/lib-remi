const scrollZoomBlock = document.querySelector('scroll-zoom-block');
const logContainer = document.querySelector('.log');
logContainer.classList.add('on');

function formatInteractionDetail(eventDetail) {
	const prefix = `<em>Last interaction</em>`;
	let detail = 'waiting...';
	if (eventDetail) {
		detail = `[${eventDetail.interaction}] <ul>`;
		detail += Object.entries(eventDetail)
			.filter(([key, value]) => key !== 'interaction')
			.map(([key, value]) => `<li>${key} = ${JSON.stringify(value)}`)
			.join('');
		detail += '</ul>';
	}
	return `${prefix} ${detail}`;
}

logContainer.innerHTML = formatInteractionDetail('');

scrollZoomBlock.addEventListener('before-interaction', event => {
	logContainer.innerHTML = formatInteractionDetail(event.detail);
});