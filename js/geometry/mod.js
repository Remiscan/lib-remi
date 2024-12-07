/**
 * Creates a point with x and y coordinates in 2D space.
 * Transforms are computed relative to the origin { x: 0, y: 0 }.
 */
export class Point2D {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    translate(dx = 0, dy = 0) {
        return new this.constructor(this.x + dx, this.y + dy);
    }
    rotate(angle = 0) {
        const rad = angle * Math.PI / 180;
        return new this.constructor(Math.cos(rad) * this.x - Math.sin(rad) * this.y, Math.sin(rad) * this.x + Math.cos(rad) * this.y);
    }
    scale(sx = 1, sy = sx) {
        return new this.constructor(sx * this.x, sy * this.y);
    }
}
/**
 * Creates a point with x, y and z coordinates in 3D space.
 * Transforms are computed relative to the origin { x: 0, y: 0, z: 0 }.
 */
export class Point3D {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    translate(dx = 0, dy = 0, dz = 0) {
        return new this.constructor(this.x + dx, this.y + dy, this.z + dz);
    }
    scale(sx = 1, sy = sx, sz = sx) {
        return new this.constructor(sx * this.x, sy * this.y, sz * this.z);
    }
    /**
     * Rotate around axis of vector [vx, vy, vz].
     */
    rotate(vx = 0, vy = 0, vz = 0, angle = 0) {
        const rad = angle * Math.PI / 180;
        const sc = Math.sin(rad / 2) * Math.cos(rad / 2);
        const sq = Math.sin(rad / 2) ** 2;
        const d = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);
        const [rx, ry, rz] = [vx, vy, vz].map(v => v / d);
        return new this.constructor((1 - 2 * (ry ** 2 + rz ** 2) * sq) * this.x + (2 * (rx * ry * sq - rz * sc)) * this.y + (2 * (rx * rz * sq + ry * sc)) * this.z, (2 * (rx * ry * sq + rz * sc)) * this.x + (1 - 2 * (rx ** 2 + rz ** 2) * sq) * this.y + (2 * (ry * rz * sq - rx * sc)) * this.z, (2 * (rx * rz * sq - ry * sc)) * this.x + (2 * (ry * rz * sq + rx * sc)) * this.y + (1 - 2 * (rx ** 2 + ry ** 2) * sq) * this.z);
    }
    rotateX(angle = 0) {
        return this.rotate(1, 0, 0, angle);
    }
    rotateY(angle = 0) {
        return this.rotate(0, 1, 0, angle);
    }
    rotateZ(angle = 0) {
        return this.rotate(0, 0, 1, angle);
    }
    perspective(d = Infinity) {
        const w = 1 - this.z / d;
        return new this.constructor((1 / w) * this.x, (1 / w) * this.y, (1 / w) * this.z);
    }
}
