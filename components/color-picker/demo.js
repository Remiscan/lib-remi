let i = 0;
for (const colorPicker of [...document.querySelectorAll('color-picker')]) {
  for (const type of ['input', 'change']) {
    colorPicker.addEventListener(type, event => {
      if (!event.detail?.color) return;
      console.log(`${i}: ${type} color ${event.detail.color}`);
    });
  }
  i++;
}