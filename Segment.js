import Point from './Point.js';
import { Bodypart } from './Bodypart.js';

export default class Segment {
	constructor(origin, segmentDistance, skinRadius, bodypart) {
		this.origin = origin;
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;

		if (bodypart instanceof Bodypart) {
			this.bodypart = bodypart;
			this.bodypart.segment = this;
		}

		this.prevSegment = undefined;
		this.nextSegment = undefined;
	}

	*[Symbol.iterator]() {
		let current = this;
		while (current) {
			yield current;
			current = current.nextSegment;
		}
	}

	static createAndLink(startingPoint, discriptors) {
		const result = discriptors[0].create(startingPoint);

		let current = result;
		let next;

		for (let index = 1; index < discriptors.length; ++index) {
			next = discriptors[index].create(current.origin);

			current.nextSegment = next;
			next.prevSegment = current;
			current = next;
		}

		return result
	}

	static step(destination, segment, speedInPixels) {
		const vectorToDestination = Point.subtract(destination, segment.origin);

		if (Point.magnitude(vectorToDestination) < speedInPixels)
			return;

		const direction = Point.multiply(Point.normalize(vectorToDestination), speedInPixels);

		segment.origin = Point.add(segment.origin, direction);
		Segment.pullNext(segment);
	}

	static pullNext(segment) {
		if (segment.nextSegment instanceof Segment) {
			const vector = Point.subtract(segment.nextSegment.origin, segment.origin);

			segment.nextSegment.origin = Point.add(segment.origin, Point.multiply(Point.normalize(vector), segment.nextSegment.segmentDistance));

			Segment.pullNext(segment.nextSegment);
		}
	}

	static getFrontVector(segment) {
		let prev = segment.prevSegment;
		let next = segment.nextSegment;

		if (!(prev instanceof Segment || next instanceof Segment))
			throw "Not enough segments!";

		if (!(prev instanceof Segment))
			prev = segment;
		if (!(next instanceof Segment))
			next = segment;

		const vector = Point.subtract(prev.origin, next.origin);

		return Point.multiply(Point.normalize(vector), segment.skinRadius);
	}
}