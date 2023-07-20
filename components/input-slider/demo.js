const sliders = document.querySelectorAll('input-slider');
const log = document.querySelector('.log');

let k = 0;
for (const slider of sliders) {
  const sliderNumber = k + 1;
  for (const type of ['input', 'change']) {
    slider.addEventListener(type, event => {
      console.log(`${sliderNumber}: ${event.type} value ${slider.value}`);
      log.innerHTML = `Slider ${sliderNumber}: ${slider.valueText}`;
    });
  }
  k++;
}