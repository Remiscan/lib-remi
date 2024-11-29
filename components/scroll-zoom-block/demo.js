const scrollZoomBlock = document.querySelector('scroll-zoom-block');
const logContainer = document.querySelector('.log');
logContainer.classList.add('on');

logContainer.innerHTML = `<em>Interaction:</em> waiting...`;

scrollZoomBlock.addEventListener('before-interaction', event => {
	logContainer.innerHTML = `<em>Interaction:</em> ${event.detail.interaction}`;
});