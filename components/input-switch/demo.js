for (const input of [...document.querySelectorAll('input-switch')]) {
  input.addEventListener('change', event => {
    document.querySelector('.log').classList.add('on');
    document.querySelector('.log').innerHTML = `<em>${event.currentTarget.shadowRoot.querySelector('button').getAttribute('aria-label')}</em> turned ${event.currentTarget.checked ? 'on' : 'off'}`;
  });
}