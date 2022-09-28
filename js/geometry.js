/**
 * Creates a point with x and y coordinates in 2D space.
 * Transform methods are available to translate, rotate and scale the point (relative to the origin { x: 0, y: 0 }).
 */
export class Point2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  translate(dx = 0, dy = 0) {
    return new Point2D(
      this.x + dx,
      this.y + dy
    );
  }

  rotate(angle = 0) {
    const rad = angle * Math.PI / 180;
    return new Point2D(
      Math.cos(rad) * this.x - Math.sin(rad) * this.y,
      Math.sin(rad) * this.x + Math.cos(rad) * this.y
    );
  }

  scale(sx = 1, sy = sx) {
    return new Point2D(
      sx * this.x,
      sy * this.y
    );
  }
}