import * as bezierLine from './bezierLine.js';
import { SegmentDiscriptor } from './Discriptor.js';
import Point from './Point.js';
import Segment from './Segment.js';

export class Bodypart {
	static TOP = true;
	static BOTTOM = false;

	constructor(segment, render) {
		this.segment = segment;
		this.render = render;
	}

	draw() { }
}

export class Eye extends Bodypart {
	constructor(segment, degreeToFront, distanceToOrigin, radius, color) {
		super(segment, Bodypart.BOTTOM);
		this.radianToFront = radians(degreeToFront);
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		const frontScaled = Point.multiply(Point.normalize(Segment.getFrontVector(this.segment)), this.distanceToOrigin);

		let eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, this.radianToFront));
		ellipse(eyePoint.x, eyePoint.y, this.radius, this.radius);

		eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, -this.radianToFront));
		ellipse(eyePoint.x, eyePoint.y, this.radius, this.radius);
	}
}

export class SideFin extends Bodypart {
	constructor(segment, length, width, angle, color) {
		super(segment, Bodypart.BOTTOM);
		this.length = length;
		this.width = width;
		this.angle = angle;
		this.color = color;
	}

	static drawEllipseByAngle(x, y, w, h, angle) {
		translate(x, y);
		rotate(radians(angle));
		ellipse(0, -(h / 2), w, h);

		resetMatrix()
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		const front = Segment.getFrontVector(this.segment);
		let frontAngle = Point.angleOfVectors(new Point(0, 1), front);

		const normalLeft = Point.add(this.segment.origin, Point.normalLeft(front));
		SideFin.drawEllipseByAngle(normalLeft.x, normalLeft.y, this.width, this.length, frontAngle - this.angle);

		const normalRight = Point.add(this.segment.origin, Point.normalRight(front));
		SideFin.drawEllipseByAngle(normalRight.x, normalRight.y, this.width, this.length, frontAngle + this.angle);
	}
}

export class BackFin extends Bodypart {
	constructor(segment, lengthInSegments, color) {
		super(segment, Bodypart.TOP);
		this.lengthInSegments = lengthInSegments;
		this.color = color;
	}

	static getPoints(fin) {
		const points = [];

		let counter = 0;
		for (const nextSegment of fin.segment) {
			if (counter > fin.lengthInSegments)
				break;

			points.push(nextSegment.origin);
			++counter;
		}

		const angle = Point.sinOfPoints(points[points.length - 3], points[points.length - 2], points[points.length - 1]);

		for (let index = points.length - 1; index > 0; --index) {
			const topPoint = Point.normalRight(Point.subtract(points[index - 1], points[index]));
			points.push(Point.add(points[index], Point.multiply(topPoint, angle)));
		}

		return points;
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		bezierLine.drawLoop(BackFin.getPoints(this));
	}
}

export class TailFin extends Bodypart {
	constructor(segment, distances, color) {
		super(segment, Bodypart.BOTTOM);

		const discriptors = [new SegmentDiscriptor(0, undefined, undefined)];
		for (const distance of distances) {
			discriptors.push(new SegmentDiscriptor(distance, undefined, undefined));
		}

		this.headJoint = Segment.createAndLink(segment.origin, discriptors);
		this.color = color;
	}

	static getPoints(fin) {
		const points = [];

		for (const nextSegment of fin.headJoint)
			points.push(nextSegment.origin);

		const angle = Point.sinOfPoints(points[points.length - 3], points[points.length - 2], points[points.length - 1]);

		for (let index = points.length - 1; index > 0; --index) {
			const topPoint = Point.normalRight(Point.subtract(points[index - 1], points[index]));
			points.push(Point.add(points[index], Point.multiply(topPoint, (index / (points.length - 1)) * 10 * angle)));
		}

		return points;
	}

	draw() {
		this.headJoint.origin = this.segment.origin;
		Segment.pullNext(this.headJoint);

		fill(this.color.r, this.color.g, this.color.b);

		bezierLine.drawLoop(TailFin.getPoints(this));
	}
}

/* export class Antenna extends Bodypart {
	constructor(length, width, color) {
		super(Bodypart.TOP);

		this.color = color;
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		const frontScaled = Point.multiply(Point.normalize(Segment.getFrontVector(this.segment)), this.distanceToOrigin);

		let eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, this.radianToFront));

		eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, -this.radianToFront));
	}
} */

/* class Leg extends Bodypart {
	constructor(segment) {
		super(segment, Bodypart.BOTTOM);
	}
} */