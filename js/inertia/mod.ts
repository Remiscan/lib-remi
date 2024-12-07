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

	/** */
	maxDelayBetweenMovesTimeout: number = -1;

	/** in degrees */
	directionChangeAngleThreshold: number = 90;


	consctructor(options: Partial<VelocityTrackerOptions> = {}) {
		Object.assign(this, options);
	}


	addPosition(position: Point2D) {
		clearTimeout(this.maxDelayBetweenMovesTimeout);

		const now = Date.now();
		const newHistory = {
			time: now,
			position: position,
		};

		//const previousHistory = this.lastHistory;

		// if (this.moveHistory.length > 1) :
		// Check that the angle of speed vector for the last two entries did not change drastically
		/*const beforeLastHistory = this.moveHistory.at(-2);
		if (previousHistory && beforeLastHistory) {
			let angle = VelocityTracker2D.getAngleBetweenVectors(
				position.translate(-previousHistory.position.x, -previousHistory.position.y),
				previousHistory.position.translate(-beforeLastHistory.position.x, -beforeLastHistory.position.y)
			);

			if (Math.abs(angle) > this.directionChangeAngleThreshold) {
				console.warn('angle change', beforeLastHistory.position, previousHistory.position, newHistory.position, angle);
				this.clear();
			}
		}*/
		
		this.moveHistory.push(newHistory);
		if (this.moveHistory.length > this.maxHistoryLength) {
			this.moveHistory.shift();
		}

		this.maxDelayBetweenMovesTimeout = window.setTimeout(() => {
			console.warn('max delay');
			this.clear();
		}, this.maxDelayBetweenMoves);
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
			.scale(1000 / deltaT); // per second
	}


	static getAngleBetweenVectors(
		vector1: Point2D,
		vector2: Point2D,
	): number {
		const delta = vector2.translate(-vector1.x, -vector1.y);
		return Math.atan2(delta.y, delta.x) * (180 / Math.PI);
	}


	static getAverageVelocity(
		velocityTrackers: Iterable<VelocityTracker2D>
	): Point2D {
		let averageVelocity = new Point2D();
		for (const tracker of velocityTrackers) {
			const velocity = tracker.velocity;
			averageVelocity = averageVelocity.translate(velocity.x, velocity.y);
		}
		return averageVelocity;
	}
}


interface InertiaTrackerOptions {
	friction: number;
	minVelocity: number;
}

/** Callback that takes a velocity as a Point2D with coordinates in **pixels per second**. */
type InertiaCallback = (diplacement: Point2D, velocity: Point2D, elapsedTime: number) => void;


/**
 * Applies inertia based on the velocity of a 2D point.
 * @fires [] inertia-started when inertia starts being applied.
 * @fires [] interia-ended when inertie is done being applied.
 */
export class InertiaTracker2D extends EventTarget {
	/** Friction coefficient. */
	friction = 4;

	/** Velocity below which movement is stopped (in pixels per second). */
	minVelocity = 20;

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


	startInertia(
		initialVelocity: Point2D,
		callback: InertiaCallback,
		abortSignal?: AbortSignal,
	): Promise<unknown> {
		if (this.isBusy) return Promise.reject('Inertia already being applied');

		this.dispatchEvent(new Event('inertia-started'));

		this.isBusy = true;
		
		const promise = new Promise(resolve => {
			this.addEventListener('inertia-ended', resolve, { once: true });
		});

		const startTime = Date.now();
		this.#applyInertia(callback, initialVelocity, startTime, abortSignal);
		return promise;
	}


	#applyInertia(
		callback: InertiaCallback,
		initialVelocity: Point2D,
		startTime: number,
		abortSignal?: AbortSignal,
	): void {
		if (abortSignal?.aborted) {
			this.isBusy = false;
			return;
		}

		const now = Date.now();
		const elapsedTime = (now - startTime) / 1000; // in seconds

		// Apply friction based on elapsed time
		const currentVelocity = initialVelocity.scale(Math.exp(-this.friction * elapsedTime));

		// If we've reached minimum speed, stop
		if (Math.sqrt(currentVelocity.x ** 2 + currentVelocity.y ** 2) < this.minVelocity) {
			this.isBusy = false;
			return;
		}

		// Total displacement after elapsedTime
		const displacement = this.getTotalDisplacement(initialVelocity, elapsedTime);

		callback(displacement, currentVelocity, elapsedTime);
		requestAnimationFrame(() => {
			this.#applyInertia(callback, initialVelocity, startTime, abortSignal)
		});
	}


	/**
	 * 
	 * @param initialVelocity - Initial velocity when inertia started, in pixels per second.
	 * @param elapsedTime - Elapsed time since inertia started, in seconds.
	 * @returns The total displacement since inertia started, in pixels.
	 */
	getTotalDisplacement(
		initialVelocity: Point2D,
		elapsedTime: number,
	): Point2D {
		const frictionFactor = (1 - Math.exp(-this.friction * elapsedTime)) / this.friction;
		return initialVelocity.scale(frictionFactor);
	}
}