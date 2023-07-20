const log = document.querySelector('.log');

let i = 0;
for (const colorPicker of [...document.querySelectorAll('color-picker')]) {
  const pickerNumber = i + 1;
  for (const type of ['input', 'change']) {
    colorPicker.addEventListener(type, event => {
      if (!event.detail?.color) return;
      console.log(`${pickerNumber}: ${type} color ${event.detail.color}`);
      log.innerHTML = `Color picker ${pickerNumber}: ${event.detail.color}`;
    });
  }
  i++;
}