import * as bezierLine from './bezierLine.js';
import { SegmentDescriptor } from './Descriptor.js';
import Point from './Point.js';
import Segment from './Segment.js';

export class Bodypart {
	static TOP = true;
	static BOTTOM = false;

	constructor(segment, render, color) {
		this.segment = segment;
		this.render = render;
		this.color = color;
	}

	draw() { }
}

export class Eye extends Bodypart {
	constructor(segment, render, degreeToFront, distanceToOrigin, radius, color) {
		super(segment, render, color);
		this.radianToFront = radians(degreeToFront);
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
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
	constructor(segment, render, length, width, angle, color) {
		super(segment, render, color);
		this.length = length;
		this.width = width;
		this.angle = angle;
	}

	static drawEllipseByAngle(x, y, angle, w, h) {
		translate(x, y);
		rotate(radians(angle));
		ellipse(0, -(h / 2), w, h);

		resetMatrix();
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		const front = Segment.getFrontVector(this.segment);
		let frontAngle = Point.angleOfVector(Point.normalRight(front));

		const normalLeft = Point.add(this.segment.origin, Point.normalLeft(front));
		SideFin.drawEllipseByAngle(normalLeft.x, normalLeft.y, frontAngle - this.angle, this.width, this.length);

		const normalRight = Point.add(this.segment.origin, Point.normalRight(front));
		SideFin.drawEllipseByAngle(normalRight.x, normalRight.y, frontAngle + this.angle, this.width, this.length);
	}
}

export class BackFin extends Bodypart {
	constructor(segment, render, lengthInSegments, color) {
		super(segment, render, color);
		this.lengthInSegments = lengthInSegments;
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
	constructor(segment, render, distances, color) {
		super(segment, render, color);

		let nextFinPart = new SegmentDescriptor(1, 1, undefined);

		const descriptors = [nextFinPart];
		for (const distance of distances) {
			nextFinPart = new SegmentDescriptor(distance, 1, undefined);

			descriptors.push(nextFinPart);
		}

		this.headJoint = Segment.createAndLink(segment.origin, descriptors);
	}

	static getPoints(fin) {
		const points = [];

		for (const nextSegment of fin.headJoint)
			points.push(nextSegment.origin);

		const angle = Point.sinOfPoints(points[points.length - 3], points[points.length - 2], points[points.length - 1]);


		for (let index = points.length - 1; index > 0; --index) {
			const topPoint = Point.normalRight(Point.subtract(points[index - 1], points[index]));
			points.push(Point.add(points[index], Point.multiply(topPoint, (index / (points.length - 1)) * 13 * angle)));
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

export class Antenna extends Bodypart {
	constructor(segment, render, descriptors, angle, color) {
		super(segment, render, color);

		this.points = Segment.getPoints(Segment.createAndLink(new Point(0, 0), descriptors));

		if (Math.abs(this.angle) < 1)
			this.pointsMirrored = null;
		else {
			this.pointsMirrored = [];

			for (const point of this.points)
				this.pointsMirrored.push(new Point(point.x, -point.y));
		}

		this.angle = angle;
	}

	static drawLoopByOrientation(x, y, angle, points) {
		translate(x, y);
		rotate(radians(angle));
		bezierLine.drawLoop(points);

		resetMatrix();
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		const bodyAngle = Point.angleOfVector(Point.reverse(Segment.getFrontVector(this.segment)));

		if (this.pointsMirrored instanceof Array) {
			Antenna.drawLoopByOrientation(this.segment.origin.x, this.segment.origin.y, bodyAngle + this.angle, this.points);
			Antenna.drawLoopByOrientation(this.segment.origin.x, this.segment.origin.y, bodyAngle - this.angle, this.pointsMirrored);
		}
		else
			Antenna.drawLoopByOrientation(this.segment.origin.x, this.segment.origin.y, bodyAngle, this.points);
	}
}

export class Leg extends Bodypart {
	constructor(segment, render, descriptors, color) {
		super(segment, render, color);

		this.joinSegment = Segment.createAndLink(segment.origin, descriptors);

		let counter = 0;
		let end = null;
		for (const nextSegment of this.joinSegment) {
			++counter;
			end = nextSegment;
		}

		if (counter < 2)
			throw "A leg must have at least 2 segment discriptors!";

		this.endSegment = end;
		this.standsOn = this.endSegment.origin;
	}

	static twoWayKinematics(leg) {
		const joinPoint = leg.joinSegment.origin;

		leg.endSegment.origin = leg.standsOn;
		Segment.pullPrev(leg.endSegment);

		leg.joinSegment.origin = joinPoint;
		Segment.pullNext(leg.joinSegment);
	}

	static break(leg) {
		for (const segment of leg.joinSegment)
			segment.origin = Point.subtract(Point.multiply(leg.segment.origin, 2), segment.origin);
	}

	draw() {
		this.joinSegment.origin = this.segment.origin;

		Leg.twoWayKinematics(this);

		if (Point.magnitude(Point.subtract(this.standsOn, this.endSegment.origin)) > this.endSegment.distanceFromPrev) {
			Leg.break(this);

			for (let i = 0; i < 10; ++i)
				Leg.twoWayKinematics(this);
		}

		this.standsOn = this.endSegment.origin;

		fill(this.color.r, this.color.g, this.color.b);

		bezierLine.drawLoop(Segment.getPoints(this.joinSegment));
	}
}