import * as bezierLine from './bezierLine.js';
import Point from './Point.js';
import Segment from './Segment.js';
import { Bodypart } from './Bodypart.js';

export default class Animal {
	constructor(headPosition, descriptors, bodyColor) {
		if (descriptors.length < 2)
			throw "An animal must have at least 2 segments!";

		this.headSegment = Segment.createAndLink(headPosition, descriptors);
		this.bodyColor = bodyColor;
	}

	static drawSpine(animal) {
		fill(0, 0, 0, 0);
		const points = [];
		for (const segment of animal.headSegment)
			points.push(segment.origin);
		bezierLine.drawLine(points);
	}

	static drawCircles(animal) {
		fill(0, 0, 0, 0);
		for (const segment of animal.headSegment)
			ellipse(segment.origin.x, segment.origin.y, segment.skinRadius * 2);
	}

	static drawOutline(animal) {
		fill(animal.bodyColor.r, animal.bodyColor.g, animal.bodyColor.b, animal.bodyColor.a);
		bezierLine.drawLoop(Segment.getPoints(animal.headSegment));
	}

	draw() {
		for (const segment of this.headSegment) {
			if (segment.bodypart instanceof Bodypart && !segment.bodypart.render)
				segment.bodypart.draw();
		}

		Animal.drawOutline(this);
		// Animal.drawCircles(this);
		// Animal.drawSpine(this);

		for (const segment of this.headSegment) {
			if (segment.bodypart instanceof Bodypart && segment.bodypart.render)
				segment.bodypart.draw();
		}
	}

	step(destination, speedInPixels) {
		const vectorToDestination = Point.subtract(destination, this.headSegment.origin);

		if (Point.magnitude(vectorToDestination) < speedInPixels)
			return;

		const direction = Point.multiply(Point.normalize(vectorToDestination), speedInPixels);

		const restrictedDirection = this.headSegment.nextSegment instanceof Segment ?
			Segment.restrictAngleOfRotation(this.headSegment, this.headSegment.nextSegment, direction) :
			direction;

		this.headSegment.origin = Point.add(this.headSegment.origin, restrictedDirection);
		Segment.pullNext(this.headSegment);
	}
}