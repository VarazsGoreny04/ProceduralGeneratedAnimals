import * as bezierLine from './bezierLine.js';
import Color from './Color.js';
import Point from './Point.js';
import Segment from './Segment.js';
import { Bodypart } from './Bodypart.js';
import { SegmentDescriptor } from './Descriptor.js';

/** Describes an animal. */
export default class Animal {
	/**
	 * Creates an Animal object.
	 * @param {Point} headPosition The head starting position.
	 * @param {SegmentDescriptor[]} descriptors The discriptors of the body of the animal.
	 * @param {number} turnAngle The maximum angle the animal can turn with.
	 * @param {Color} bodyColor The color of the animals body.
	 * @param {number} speed The speed of the animal.
	 */
	constructor(headPosition, descriptors, turnAngle, bodyColor, speed) {
		if (descriptors.length < 2)
			throw "An animal must have at least 2 segments!";

		this.headSegment = Segment.createAndLink(headPosition, descriptors);
		this.bodyColor = bodyColor;

		this.headSegment.maxAngle = turnAngle;
		this.headSegment.minAngle = -this.headSegment.maxAngle;

		this.speed = speed;
	}

	/**
	 * Draws a line on the spine of the animal.
	 * @param {Animal} animal The animal.
	 */
	static drawSpine(animal) {
		fill(0, 0, 0, 0);

		const points = [];
		for (const segment of animal.headSegment)
			points.push(segment.origin);

		bezierLine.drawLine(points);
	}

	/**
	 * Draws a circle to every segment of the body.
	 * @param {Animal} animal The animal.
	 */
	static drawCircles(animal) {
		fill(0, 0, 0, 0);

		for (const segment of animal.headSegment)
			ellipse(segment.origin.x, segment.origin.y, segment.skinRadius * 2);
	}

	/**
	 * Draws the outline of the animal.
	 * @param {Animal} animal The animal.
	 */
	static drawOutline(animal) {
		fill(animal.bodyColor.r, animal.bodyColor.g, animal.bodyColor.b, animal.bodyColor.a);

		bezierLine.drawLoop(Segment.getPoints(animal.headSegment));
	}

	/** Draws this animal instance. */
	draw() {
		for (const segment of this.headSegment)
			Segment.drawBodyparts(segment, Bodypart.BOTTOM);

		Animal.drawOutline(this);
		// Animal.drawCircles(this);
		// Animal.drawSpine(this);

		for (const segment of this.headSegment)
			Segment.drawBodyparts(segment, Bodypart.TOP);
	}

	/**
	 * Moves this animal instance to the given direction.
	 * @param {Point} destination The given direction.
	 */
	step(destination) {
		const vectorToDestination = Point.subtract(destination, this.headSegment.origin);

		if (Point.magnitude(vectorToDestination) < this.speed)
			return;

		const direction = Point.scale(vectorToDestination, this.speed);

		const restrictedDirection = this.headSegment.nextSegment instanceof Segment ?
			Segment.restrictAngleOfRotation(this.headSegment, this.headSegment.nextSegment, direction) :
			direction;

		this.headSegment.origin = Point.add(this.headSegment.origin, restrictedDirection);
		Segment.pullNext(this.headSegment);
	}
}