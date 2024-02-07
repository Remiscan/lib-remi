import { Point2D } from '/_common/js/geometry/mod.js';
import { mulberry32, xmur3a } from '/_common/js/prng/mod.js';



class Shape {
  constructor(points) {
    this.points = points;
  }

  draw(ctx, fillColor) {
    ctx.fillStyle = fillColor;
    const shape = new Path2D();
    shape.moveTo(this.points[0].x, this.points[0].y);
    for (const corner of this.points) {
      shape.lineTo(corner.x, corner.y);
    }
    shape.closePath();
    ctx.fill(shape);
  }

  static horizontalSymmetry(points) {
    return [...points, ...points.reverse().map(p => new Point2D(-p.x, p.y))];
  }
}

// Central hexagon

class Hexagon extends Shape {
  constructor(height) {
    super(
      Array.from(
        Array(6)).map((p, k) => {
          return new Point2D(0, height)
            .rotate((k / 6) * 360);
        }
      )
    );
  }
}

// Branches

class HalfBranch extends Shape {
  constructor(steps = 10, branchWidth, branchHeight, rng) {
    const minWidth = .05 * branchWidth;
    const maxWidth = .25 * branchWidth;
    super(
      Array.from(
        Array(steps)).map((p, k) => {
          return new Point2D(
            minWidth + rng() * (maxWidth - minWidth),
            k * (branchHeight / (steps - 1))
          );
        }
      )
    );
    this.points[steps - 1] = new Point2D(0, branchHeight);
  }
}

class Branch extends Shape {
  constructor(branchWidth, branchHeight, rng) {
    const halfBranch = new HalfBranch(10, branchWidth, branchHeight, rng);
    super(Shape.horizontalSymmetry(halfBranch.points));
  }
}



registerPaint('snowflake', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--flake-color']; }

  paint(ctx, size, props) {
    const baseSeed = props.get('--base-seed');
    const flakeColor = props.get('--flake-color');

    const seed = xmur3a(`${baseSeed}`);
    const random = mulberry32(seed());

    const width = size.width;
    const branchHeight = .5 * width;
    const branchWidth = .5 * width;

    ctx.translate(.5 * width, .5 * width);

    const hex = new Hexagon(random() * branchHeight);
    hex.draw(ctx, flakeColor);
    
    const branch = new Branch(branchWidth, branchHeight, random);
    console.log(branch);
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i / 6) * 2 * Math.PI);
      branch.draw(ctx, flakeColor);
      ctx.restore();
    }

    /*
    const corners = [
      new Point2D(0, 0),
      new Point2D(.05 * width, 0),
      new Point2D(.04 * width, -.45 * width),
      new Point2D(0, -.5 * width)
    ];

    for (let i = 0; i < mainBranches; i++) {
      ctx.save();

      ctx.rotate((i / 6) * 2 * Math.PI);
      ctx.fillStyle = flakeColor;

      // Symmetry on both sides of a branch
      const branch = horizontalSymmetry(corners);
      const shape = new Path2D();
      shape.moveTo(branch[0].x, branch[0].y);
      for (const corner of branch) {
        shape.lineTo(corner.x, corner.y);
      }
      shape.closePath();
      ctx.fill(shape);

      ctx.restore();
    }

    const maxNumOfHexagons = 3;
    const hexagonNumber = 1 + Math.round((maxNumOfHexagons - 1) * commonRandom());
    const hexagonMinLineWidthCoeff = .02;
    const hexagonMaxLineWidthCoeff = .12;
    for (let h = 0; h < hexagonNumber; h++) {
      const hexagonPoint = new Point2D(
        0,
        -(Math.min((.5 - hexagonMaxLineWidthCoeff) * width, (1 / maxNumOfHexagons) * (h + commonRandom()))) * .5 * width
      );
      const hexagon =Array.from(Array(6)).map((p, k) => hexagonPoint.rotate((k / 6) * 360));
      console.log(hexagon);

      const shape = new Path2D();
      shape.moveTo(hexagon[0].x, hexagon[0].y);
      for (const corner of hexagon) {
        shape.lineTo(corner.x, corner.y);
      }
      shape.closePath();

      ctx.save();
      ctx.strokeStyle = flakeColor;
      ctx.lineWidth = (hexagonMinLineWidthCoeff + (hexagonMaxLineWidthCoeff - hexagonMinLineWidthCoeff) * commonRandom()) * width;
      ctx.stroke(shape);
      ctx.restore();
    }
    */
  }
});