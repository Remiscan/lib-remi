const sliders = document.querySelectorAll('input-slider');
for (const slider of sliders) {
  for (const type of ['input', 'change']) {
    slider.addEventListener(type, event => {
      console.log(slider, event.type, event.detail);
    })
  }
}