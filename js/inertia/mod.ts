import { Point2D } from "geometry";



interface PositionHistoryEntry {
	time: number;
	position: Point2D;
}

interface VelocityTrackerOptions {
	maxHistoryLength: number;
	maxDelayBetweenMoves: number;
	directionChangeAngleThreshold: number;
}


/** Tracks the velocity of a moving 2D point. */
export class VelocityTracker2D {
	moveHistory: Array<PositionHistoryEntry> = [];

	get lastHistory(): PositionHistoryEntry | undefined {
		return this.moveHistory.at(-1);
	}

	maxHistoryLength: number = 5;

	/** in milliseconds */
	maxDelayBetweenMoves: number = 100;

	/** in degrees */
	directionChangeAngleThreshold: number = 45;


	consctructor(options: Partial<VelocityTrackerOptions> = {}) {
		Object.assign(this, options);
	}


	addPosition(position: Point2D) {
		const now = Date.now();
		const newHistory = {
			time: now,
			position: position,
		};

		const previousHistory = this.lastHistory;

		if ((now - (previousHistory?.time ?? 0)) > this.maxDelayBetweenMoves) {
			this.clear();
		}

		// if (this.moveHistory.length > 1) :
		// Check that the angle of speed vector for the last two entries did not change drastically
		const beforeLastHistory = this.moveHistory.at(-2);
		if (previousHistory && beforeLastHistory) {
			const angle = VelocityTracker2D.getAngleBetweenVectors(
				position.translate(previousHistory.position.x, previousHistory.position.y),
				previousHistory.position.translate(beforeLastHistory.position.x, beforeLastHistory.position.y)
			);

			if (Math.abs(angle) > this.directionChangeAngleThreshold) {
				this.clear();
			}
		}
		
		this.moveHistory.push(newHistory);
		if (this.moveHistory.length > this.maxHistoryLength) {
			this.moveHistory.shift();
		}
	}


	clear() {
		this.moveHistory = [];
	}


	get velocity(): Point2D {
		if (this.moveHistory.length < 2) return new Point2D();
		return VelocityTracker2D.getVelocity(
			this.moveHistory[0],
			this.moveHistory[this.moveHistory.length - 1],
		);
	}


	static getVelocity(
		earlierHistory: PositionHistoryEntry,
		laterHistory: PositionHistoryEntry,
	): Point2D {
		const deltaT = laterHistory.time - earlierHistory.time;
		if (deltaT === 0) return new Point2D();

		return laterHistory.position
			.translate(-earlierHistory.position.x, -earlierHistory.position.y)
			.scale(deltaT / 1000); // per second
	}


	static getAngleBetweenVectors(
		vector1: Point2D,
		vector2: Point2D,
	): number {
		const delta = vector2.translate(-vector1.x, -vector1.y);
		return Math.atan2(delta.y, delta.x) * (180 / Math.PI);
	}
}


interface InertiaTrackerOptions {
	friction: number;
	minVelocity: number;
}

/** Callback that takes a velocity as a Point2D with coordinates in **pixels per second**. */
type InertiaCallback = (velocity: Point2D, deltaT: number) => void;


/**
 * Applies inertia based on the velocity of a 2D point.
 * @fires [] inertia-started when inertia starts being applied.
 * @fires [] interia-ended when inertie is done being applied.
 */
export class InertiaTracker2D extends EventTarget {
	/** Fraction of speed remaining after one second. */
	friction = .5;

	/** Velocity below which movement is stopped (in pixels per second). */
	minVelocity = .1;

	/** Whether inertia is currently being applied. */
	#isBusy = false;

	/** Whether inertia is currently being applied. */
	get isBusy() {
		return this.#isBusy;
	}

	set isBusy(bool) {
		this.#isBusy = bool;
		if (!bool) this.dispatchEvent(new Event('inertia-ended'));
	}


	constructor(options: Partial<InertiaTrackerOptions> = {}) {
		super();
		Object.assign(this, options);
	}


	/** Current velocity during inertia. */
	currentVelocity = new Point2D();


	startInertia(
		initialVelocity: Point2D,
		callback: InertiaCallback,
		abortSignal: AbortSignal | undefined,
	): Promise<unknown> {
		if (this.isBusy) return Promise.reject('Inertia already being applied');

		this.dispatchEvent(new Event('inertia-started'));

		this.isBusy = true;
		this.currentVelocity = initialVelocity;
		
		const promise = new Promise(resolve => {
			this.addEventListener('inertia-ended', resolve, { once: true });
		});
		this.#applyInertia(callback, 0, abortSignal);
		return promise;
	}


	#applyInertia(
		callback: InertiaCallback,
		previousTime: number,
		abortSignal: AbortSignal | undefined,
	): void {
		if (abortSignal?.aborted) {
			this.isBusy = false;
			return;
		}

		const now = Date.now();
		if (!previousTime) previousTime = now;

		const deltaT = (now - previousTime) / 1000; // seconds

		// Apply friction based on elapsed time
		this.currentVelocity = this.currentVelocity.scale(Math.pow(this.friction, deltaT));

		// If we've reached minimum speed, stop
		if (Math.sqrt(this.currentVelocity.x ** 2 + this.currentVelocity.y ** 2) < this.minVelocity) {
			this.isBusy = false;
			return;
		}

		callback(this.currentVelocity, deltaT);
		requestAnimationFrame(() => {
			this.#applyInertia(callback, now, abortSignal)
		});
	}
}