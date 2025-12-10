import * as bezierLine from './bezierLine.js';
import Point from './Point.js';
import Segment from './Segment.js';
import { Bodypart } from './Bodypart.js';

export default class Animal {
	constructor(headPosition, descriptors, bodyColor) {
		this.headSegment = Segment.createAndLink(headPosition, descriptors);
		this.bodyColor = bodyColor;
	}

	static drawByCircles(animal) {
		for (const segment of animal.headSegment) {
			if (segment.bodypart instanceof Bodypart && !segment.bodypart.render)
				segment.bodypart.draw();
		}

		for (const segment of animal.headSegment)
			ellipse(segment.origin.x, segment.origin.y, segment.skinRadius * 2);

		for (const segment of animal.headSegment) {
			if (segment.bodypart instanceof Bodypart && segment.bodypart.render)
				segment.bodypart.draw();
		}
	}

	draw() {
		for (const segment of this.headSegment) {
			if (segment.bodypart instanceof Bodypart && !segment.bodypart.render)
				segment.bodypart.draw();
		}

		fill(this.bodyColor.r, this.bodyColor.g, this.bodyColor.b, this.bodyColor.a);
		bezierLine.drawLoop(Segment.getPoints(this.headSegment));

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