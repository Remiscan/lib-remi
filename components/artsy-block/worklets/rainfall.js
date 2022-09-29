import { Point2D, Point3D } from '/_common/js/geometry.js';
import { mulberry32, xmur3a } from '/_common/js/prng.js';



registerPaint('rainfall', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--cell-size', '--frequency', '--base-hue', '--base-saturation', '--base-lightness', '--max-hue-spread', '--fall-duration', '--wave-duration', '--drop-width-ratio', '--drop-height-ratio', '--anim-progress']; }

  paint(ctx, size, props) {
    const baseSeed = props.get('--base-seed');

    const cellSize = Math.max(3, Number(props.get('--cell-size'))) || 40;
    const frequency = Number(props.get('--frequency')) ?? 100;
    const baseHue = Number(props.get('--base-hue'));
    const baseSaturation = Number(props.get('--base-saturation'));
    const baseLightness = Number(props.get('--base-lightness'));
    const maxHueSpread = Number(props.get('--max-hue-spread'));
    const fallDuration = Number(props.get('--fall-duration'));
    const waveDuration = Number(props.get('--wave-duration'));
    const animDuration = fallDuration + waveDuration;
    const animProgress = Number(props.get('--anim-progress'));

    const columns = Math.ceil(size.width / cellSize);
    const rows = Math.ceil(size.height / cellSize);

    const dropWidth = cellSize / Number(props.get('--drop-width-ratio'));
    const dropHeight = cellSize / Number(props.get('--drop-height-ratio'));

    // Rain drop shape
    const origin = new Point2D(0, 0);
    const drop = [
      origin.translate(0, 0),
      origin.translate(dropWidth, 0),
      origin.translate(dropWidth, dropHeight),
      origin.translate(0, dropHeight)
    ];

    // Wave shape
    const origin3D = new Point3D(0, 0, 0);
    const wave = [
      origin3D.translate(cellSize / 2, cellSize / 2), // center of the ellipse
      origin3D.translate(0, cellSize / 2),            // point to the left of the horizontal axis of the ellipse
      origin3D.translate(cellSize / 2, 0),            // point to the top of the vertical axis of the ellipse
    ];
    
    const commonSeed = xmur3a(`${baseSeed}`);
    const commonRandom = mulberry32(commonSeed());

    // Fall angle (negative angle = from the left)
    const maxFallAngle = 20;
    const fallAngle = -maxFallAngle + 2 * maxFallAngle * commonRandom();
    const fallDistanceX = Math.tan(-fallAngle * Math.PI / 180) * size.height;

    // Number of columns to add outside of the screen to compensate for fall angle
    // (to avoid empty spaces in top corners due to missing rain drops)
    const safeCol = Math.ceil(Math.abs(fallDistanceX) / cellSize);
    const minCol = fallAngle <= 0 ? 0 : -safeCol;
    const maxCol = fallAngle >= 0 ? columns : columns + safeCol;

    for (let row = -1; row < rows + 1; row++) {
      for (let col = minCol; col < maxCol; col++) {
        const seed = xmur3a(`${baseSeed} row ${row} col ${col}`);
        const random = mulberry32(seed());

        // Only display frequency% of cells
        const rand = Math.ceil(random() * 100);
        if (rand > frequency) continue;

        const delay = random();
        const progress = ((animProgress + delay) * animDuration) % animDuration;

        const offset = {
          x: 0.5 * (-1 + random() * 2) * cellSize,
          y: 0.5 * (-1 + random() * 2) * cellSize,
        }

        // Make drops and waves smaller when they're in the distance
        const depth = (rows - row) / rows;
        const depthMinScale = .5;
        const depthScale = 1 - depth * (1 - depthMinScale);

        // Make drops and waves more transparent when they're in the distance
        const depthMinOpacity = .5;
        const depthOpacity = 1 - depth * (1 - depthMinOpacity);

        // Randomize cell color
        const hue = baseHue + (-1 + 2 * random()) * maxHueSpread;

        // Time between the bottom and the top of the rain drop touch the ground
        const crashDuration = (dropHeight / size.height) * fallDuration;

        /* RAIN DROP falling */

        if (progress <= fallDuration + crashDuration) {
          const fallProgress = progress;
          const coeffProgress = fallProgress / fallDuration;

          // Scaling factor for the rain drop WHILE it's crashing to the ground
          const crashProgressCoeff = Math.max(0, progress - fallDuration) / crashDuration;

          const endPoint = wave[0]
            .translate(offset.x, offset.y)              // move shape by random offset
            .translate(col * cellSize, row * cellSize)  // move shape to correct row and column
            .scale(1, .5, 1)                            // scale "ground" to be half of the screen
            .translate(0, -size.height / 2)             // move origin to bottom left of ground
            .rotateX(70)                                // rotate the ground to flatten it in 3D space
            .translate(0, size.height)                  // move "ground" to bottom of the screen
            ;

          const distanceCoeff = endPoint.y / size.height;

          const startPoint = new Point2D(
            endPoint.x - fallDistanceX * distanceCoeff,
            0
          );

          const currentPoint = new Point2D(
            startPoint.x + (endPoint.x - startPoint.x) * Math.min(coeffProgress, 1),
            startPoint.y + (endPoint.y - startPoint.y) * Math.min(coeffProgress, 1)
          );

          // Ignore rain drops that are out of screen
          if (currentPoint.x < 0 || currentPoint.x > size.width) continue;

          const corners = drop.map(point => point
            .translate(-.5 * dropWidth, -dropHeight)      // move origin to bottom center of shape
            .scale(depthScale, depthScale, 1)             // scale shape according to depth
            .scale(1, 1 - crashProgressCoeff, 1)          // scale drop while crashing
            .translate(.5 * dropWidth, dropHeight)        // move origin back to top left of shape
            .translate(-.5 * dropWidth, -.5 * dropHeight) // move origin to center of shape
            .rotate(fallAngle)                            // rotate rain drop according to fall angle
            .translate(
              Math.sign(fallAngle) * Math.abs(.5 * dropHeight * Math.sin(fallAngle * Math.PI / 180)),
              -.5 * dropHeight * Math.cos(fallAngle * Math.PI / 180)
            ) // move origin to bottom center of rain drop (after scaling and rotation!)
            .translate(currentPoint.x, currentPoint.y)    // move rain drop to current point
          );

          // Draw the rain drop
          ctx.fillStyle = `hsl(${hue}, ${baseSaturation}%, ${baseLightness}%, ${depthOpacity})`;
          const shape = new Path2D();
          shape.moveTo(corners[0].x, corners[0].y);
          for (const corner of corners) {
            shape.lineTo(corner.x, corner.y);
          }
          shape.closePath();
          ctx.fill(shape);
        }

        /* WAVE where the rain drop fell */

        if (progress > fallDuration) {
          const waveProgress = progress - fallDuration;
          const coeffProgress = waveProgress / waveDuration;

          const ellipse = wave.map(point => point
            .translate(-.5 * cellSize, -.5 * cellSize)  // move origin to center of shape
            .scale(coeffProgress, coeffProgress, 1)     // scale shape according to animation progress
            .scale(depthScale, depthScale, 1)           // scale shape according to depth
            .translate(.5 * cellSize, .5 * cellSize)    // move origin back to top left of shape
            .translate(offset.x, offset.y)              // move shape by random offset
            .translate(col * cellSize, row * cellSize)  // move shape to correct row and column
            .scale(1, .5, 1)                            // scale "ground" to be half of the screen
            .translate(0, -size.height / 2)             // move origin to bottom left of ground
            .rotateX(70)                                // rotate the ground to flatten it in 3D space
            .translate(0, size.height)                  // move "ground" to bottom of the screen
          );

          const center = ellipse[0];
          const rx = center.x - ellipse[1].x; // radius of the horizontal axis of the ellipse
          const ry = center.y - ellipse[2].y; // radius of the vertical axis of the ellipse

          // Ignore waves that are out of screen
          if (ellipse[1].x + 2 * rx < 0) continue;
          if (ellipse[1].x > size.width) continue;

          const opacity = (1 - coeffProgress) * depthOpacity;

          // Draw the wave
          ctx.fillStyle = `hsl(${hue}, ${baseSaturation}%, ${baseLightness}%, ${opacity})`;
          ctx.beginPath();
          ctx.ellipse(center.x, center.y, rx, ry, 0, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }
});