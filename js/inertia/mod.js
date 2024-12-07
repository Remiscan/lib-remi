/** @import { Point2D } from "../geometry/mod.js" */



/** @typedef {{time: number, position: Point2D}} PositionHistoryEntry */
/** @typedef {{ maxHistoryLength: number, maxDelayBetweenMoves: number, directionChangeAngleThreshold: number }} VelocityTrackerOptions */


/** Tracks the velocity of a moving 2D point. */
export class VelocityTracker2D {
	/** @type {Array<PositionHistoryEntry>} */
	moveHistory = [];

	/** @type {PositionHistoryEntry | undefined} */
	get lastHistory() {
		return this.moveHistory.at(-1);
	}

	/** @type {number} */
	maxHistoryLength = 5;

	/** @type {number} in milliseconds */
	maxDelayBetweenMoves = 100;

	/** @type {number} in degrees */
	directionChangeAngleThreshold = 45;


	/**
	 * @param {Partial<VelocityTrackerOptions>} options 
	 */
	consctructor(options = {}) {
		Object.assign(this, options);
	}


	/**
	 * @param {Point2D} position
	 */
	addPosition(position) {
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


	/** @returns {Point2D} */
	get velocity() {
		if (this.moveHistory.length < 2) return new Point2D();
		return VelocityTracker2D.getVelocity(
			this.moveHistory[0],
			this.moveHistory[this.moveHistory.length - 1],
		);
	}


	/**
	 * @param {PositionHistoryEntry} earlierHistory
	 * @param {PositionHistoryEntry} laterHistory
	 * @returns {Point2D}
	 */
	static getVelocity(
		earlierHistory,
		laterHistory,
	) {
		const deltaT = laterHistory.time - earlierHistory.time;
		if (deltaT === 0) return new Point2D();

		return laterHistory.position
			.translate(-earlierHistory.position.x, -earlierHistory.position.y)
			.scale(deltaT / 1000); // per second
	}


	/**
	 * @param {Point2D} vector1
	 * @param {Point2D} vector2
	 * @returns {number} in degrees
	 */
	static getAngleBetweenVectors(
		vector1,
		vector2,
	) {
		const delta = vector2.translate(-vector1.x, -vector1.y);
		return Math.atan2(delta.y, delta.x) * (180 / Math.PI);
	}
}


/** @typedef {{ friction: number, minVelocity: number }} InertiaTrackerOptions */
/**
 * Callback that takes a velocity as a Point2D with coordinates in **pixels per second**.
 * @typedef {(velocity: Point2D, deltaT: number) => void} InertiaCallback
 */


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


	/** @type {Partial<InertiaTrackerOptions>} */
	constructor(options = {}) {
		super();
		Object.assign(this, options);
	}


	/** Current velocity during inertia. */
	currentVelocity = new Point2D();


	/**
	 * Starts applying inertia.
	 * @param {Point2D} initialVelocity - The initial velocity when inertia starts being applied (coordinates in px/s).
	 * @param {InertiaCallback} callback - The callback that will be executed on each frame.
	 * @param {AbortSignal|undefined} abortSignal - An AbortSignal to cancel inertia if desired.
	 * @returns {Promise<void>}
	 */
	startInertia(
		initialVelocity,
		callback,
		abortSignal,
	) {
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


	/**
	 * Applies inertia for a frame.
	 * @param {InertiaCallback} callback
	 * @param {number} previousTime
	 * @param {AbortSignal|undefined} abortSignal
	 * @returns {void}
	 */
	#applyInertia(
		callback,
		previousTime,
		abortSignal,
	) {
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