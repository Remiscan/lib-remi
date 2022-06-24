registerPaint('gradientBorder', class {
  static get inputProperties() { return ['background-image', '--gradient', '--border-width']; }
  static get contextOptions() { return { alpha: true }; }

  gradient(gradientString) {
    const regex = /((?:repeating-)?(?:linear|radial|conic)-gradient)\((.+)\)/;
    const result = gradientString.match(regex);
    console.log(result);
    return {
      type: '',
      colors: []
    }
  }

  paint(ctx, size, props, args) {
    const gradientString = props.get('--gradient')[0];
    const g = this.gradient(gradientString);
    const borderWidth = Number(props.get('--border-width'));
    const safeBorderWidth = Math.sqrt(2) * borderWidth;
    const margin = Math.ceil(safeBorderWidth) - safeBorderWidth;

    /*if (borderWidth > 0) {
      ctx.rect(borderWidth / 2, borderWidth / 2, size.width - borderWidth, size.height - borderWidth); // order: x, y, w, h
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = 'black';
      ctx.stroke();
    }*/
  }
});