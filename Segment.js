import Point from './Point.js';

export default class Segment {
	constructor(origin, segmentDistance, skinRadius, bodypart) {
		this.origin = origin;
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;
		this.bodypart = bodypart;
	}

	*[Symbol.iterator]() {
		let current = this;
		while (current) {
			yield current;
			current = current.nextSegment;
		}
	}

	static step(segment, speedInPixels) {
		const vectorToMouse = Point.subtract(Point.mouse(), segment.origin);

		if (Point.magnitude(vectorToMouse) < speedInPixels)
			return;

		const direction = Point.multiply(Point.normalize(vectorToMouse), speedInPixels);

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