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

	static pullNext(segment) {
		if (segment.nextSegment instanceof Segment) {
			const fromSegmentToNext = Point.subtract(segment.nextSegment.origin, segment.origin);
			let toJoinPoint = Point.multiply(Point.normalize(fromSegmentToNext), segment.nextSegment.distanceFromPrev);

			if (segment.prevSegment instanceof Segment)
				toJoinPoint = Segment.restrictAngleOfRotation(segment, segment.prevSegment, toJoinPoint);

			segment.nextSegment.origin = Point.add(segment.origin, toJoinPoint);

			Segment.pullNext(segment.nextSegment);
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

		return Point.multiply(Point.normalize(vector), segment.skinRadius);
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

		return Point.restrictAngleOfRotation(fromNextToSegment, direction, secondSegment.maxAngle, secondSegment.minAngle);
	}
}