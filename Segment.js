import Point from './Point.js';

export default class Segment {
	constructor(origin, distanceFromPrev, skinRadius, bodyparts) {
		this.origin = origin;
		this.distanceFromPrev = distanceFromPrev;
		this.skinRadius = skinRadius;
		this.maxAngle = Math.min(20 * this.distanceFromPrev / this.skinRadius, 60);
		this.minAngle = -this.maxAngle;

		this.bodyparts = bodyparts;
		if (bodyparts instanceof Array) {
			for (const bodypart of bodyparts)
				bodypart.segment = this;
		}

		this.prevSegment = null;
		this.nextSegment = null;
	}

	*[Symbol.iterator]() {
		let current = this;
		while (current) {
			yield current;
			current = current.nextSegment;
		}
	}

	static createAndLink(startingPoint, descriptors) {
		const result = descriptors[0].create(startingPoint);

		let current = result;
		let next;

		for (let index = 1; index < descriptors.length; ++index) {
			next = descriptors[index].create(current.origin);

			current.nextSegment = next;
			next.prevSegment = current;

			current = next;
		}

		Segment.pullNext(result);

		return result;
	}

	static pull(segment, segmentToPull, distanceBetween, segmentInFront = null) {
		const fromSegmentToNext = Point.subtract(segmentToPull.origin, segment.origin);
		let toJoinPoint = Point.scale(fromSegmentToNext, distanceBetween);

		if (segmentInFront instanceof Segment)
			toJoinPoint = Segment.restrictAngleOfRotation(segment, segmentInFront, toJoinPoint);

		segmentToPull.origin = Point.add(segment.origin, toJoinPoint);
	}

	static pullNext(segment) {
		if (segment.nextSegment instanceof Segment) {
			Segment.pull(segment, segment.nextSegment, segment.nextSegment.distanceFromPrev, segment.prevSegment);

			Segment.pullNext(segment.nextSegment);
		}
	}

	static pullPrev(segment) {
		if (segment.prevSegment instanceof Segment) {
			Segment.pull(segment, segment.prevSegment, segment.distanceFromPrev, segment.nextSegment);

			Segment.pullPrev(segment.prevSegment);
		}
	}

	static getFrontVector(segment) {
		let prev = segment.prevSegment;
		let next = segment.nextSegment;

		if (!(prev instanceof Segment) && !(next instanceof Segment))
			throw "Not enough segments!";

		prev ??= segment;
		next ??= segment;

		const vector = Point.subtract(prev.origin, next.origin);

		return Point.scale(vector, segment.skinRadius);
	}

	static getPoints(headSegment) {
		const roundNoseAngle = radians(45);

		const frontVector = Segment.getFrontVector(headSegment);

		const left = [
			Point.add(headSegment.origin, frontVector),
			Point.add(headSegment.origin, Point.rotateRadian(frontVector, roundNoseAngle))
		];
		const right = [
			Point.add(headSegment.origin, Point.rotateRadian(frontVector, -roundNoseAngle))
		];

		let tailSegment;

		for (const segment of headSegment) {
			let front = Segment.getFrontVector(segment);

			left.push(Point.add(segment.origin, Point.normalLeft(front)));
			right.push(Point.add(segment.origin, Point.normalRight(front)));

			tailSegment = segment;
		}

		const backVector = Point.reverse(Segment.getFrontVector(tailSegment));

		left.push(Point.add(tailSegment.origin, Point.rotateRadian(backVector, -roundNoseAngle)));
		right.push(Point.add(tailSegment.origin, Point.rotateRadian(backVector, roundNoseAngle)));

		left.push(Point.add(tailSegment.origin, backVector));

		return left.reverse().concat(right);
	}

	static drawBodyparts(segment, render) {
		if (segment.bodyparts instanceof Array) {
			for (const bodypart of segment.bodyparts) {
				if (bodypart.render === render)
					bodypart.draw();
			}
		}
	}

	static restrictAngleOfRotation(firstSegment, secondSegment, direction) {
		const fromSecondToFirst = Point.subtract(firstSegment.origin, secondSegment.origin);

		return Point.restrictAngleOfRotation(fromSecondToFirst, direction, firstSegment.maxAngle, firstSegment.minAngle);
	}
}