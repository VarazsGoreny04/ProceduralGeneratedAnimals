import Point from './Point.js';

export default class Segment {
	static MAXANGLE = 20;

	constructor(origin, distanceFromPrev, skinRadius, bodyparts) {
		this.origin = origin;
		this.distanceFromPrev = distanceFromPrev;
		this.skinRadius = skinRadius;
		this.maxAngle = Math.min(Segment.MAXANGLE * this.distanceFromPrev / this.skinRadius, 60);
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

		const front = Segment.getFrontVector(headSegment);

		const left = [Point.add(headSegment.origin, front), Point.add(headSegment.origin, Point.rotateRadian(front, roundNoseAngle))];
		const right = [Point.add(headSegment.origin, Point.rotateRadian(front, -roundNoseAngle))];

		let end;

		for (const segment of headSegment) {
			let front = Segment.getFrontVector(segment);

			left.push(Point.add(segment.origin, Point.normalLeft(front)));
			right.push(Point.add(segment.origin, Point.normalRight(front)));

			end = segment;
		}

		const back = Point.reverse(Segment.getFrontVector(end));

		left.push(Point.add(end.origin, Point.rotateRadian(back, -roundNoseAngle)));
		right.push(Point.add(end.origin, Point.rotateRadian(back, roundNoseAngle)));

		left.push(Point.add(end.origin, back));

		return left.reverse().concat(right);
	}

	static restrictAngleOfRotation(firstSegment, secondSegment, direction) {
		const fromNextToSegment = Point.subtract(firstSegment.origin, secondSegment.origin);

		return Point.restrictAngleOfRotation(fromNextToSegment, direction, firstSegment.maxAngle, firstSegment.minAngle);
	}
}