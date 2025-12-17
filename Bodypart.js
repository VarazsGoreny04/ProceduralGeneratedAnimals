import * as bezierLine from './bezierLine.js';
import { LegSegmentDescriptor, SegmentDescriptor } from './Descriptor.js';
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

		const frontScaled = Point.scale(Segment.getFrontVector(this.segment), this.distanceToOrigin);

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
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

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
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

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

		fill(this.color.r, this.color.g, this.color.b, this.color.a);

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
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		const bodyAngle = Point.angleOfVector(Point.reverse(Segment.getFrontVector(this.segment)));

		if (this.pointsMirrored instanceof Array) {
			Antenna.drawLoopByOrientation(this.segment.origin.x, this.segment.origin.y, bodyAngle + this.angle, this.points);
			Antenna.drawLoopByOrientation(this.segment.origin.x, this.segment.origin.y, bodyAngle - this.angle, this.pointsMirrored);
		}
		else
			Antenna.drawLoopByOrientation(this.segment.origin.x, this.segment.origin.y, bodyAngle, this.points);
	}
}

class OneLeg {
	constructor(origin, descriptors) {
		this.joinSegment = Segment.createAndLink(origin, descriptors);

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

		this.range = Point.magnitude(Point.subtract(this.endSegment.origin, this.joinSegment.origin));
	}

	static getNewTarget(leg, frontVector, normalVector, stepTo) {
		const toSide = Point.multiply(normalVector, stepTo.x);
		const toFront = Point.multiply(frontVector, stepTo.y);
		const direction = Point.add(toSide, toFront);

		return Point.add(leg.joinSegment.origin, (Point.magnitude(direction) > leg.range ? Point.scale(direction, leg.range) : direction));
	}

	static twoWayKinematics(leg) {
		const joinPoint = leg.joinSegment.origin;

		leg.endSegment.origin = leg.standsOn;
		Segment.pullPrev(leg.endSegment);

		leg.joinSegment.origin = joinPoint;
		Segment.pullNext(leg.joinSegment);
	}

	static break(origin, leg) {
		for (const segment of leg.joinSegment)
			segment.origin = Point.subtract(Point.multiply(origin, 2), segment.origin);
	}

	static draw(leg, color) {
		OneLeg.twoWayKinematics(leg);

		const distanceFromTarget = Point.magnitude(Point.subtract(leg.standsOn, leg.endSegment.origin));

		if (distanceFromTarget > leg.endSegment.distanceFromPrev) {
			OneLeg.break(leg.joinSegment.origin, leg);

			for (let i = 0; i < 5; ++i)
				OneLeg.twoWayKinematics(leg);
		}

		fill(color.r, color.g, color.b, color.a);

		bezierLine.drawLoop(Segment.getPoints(leg.joinSegment));
	}
}

export class Leg extends Bodypart {
	constructor(segment, render, descriptors, stepTo, color) {
		super(segment, render, color);

		this.left = new OneLeg(segment.origin, descriptors);

		const mirroredDiscriptors = [];
		for (const discriptor of descriptors)
			mirroredDiscriptors.push(LegSegmentDescriptor.mirror(discriptor));
		this.right = new OneLeg(segment.origin, mirroredDiscriptors);

		this.stepTo = stepTo;
	}

	static drawOne(segment, frontVector, normalVector, leg, color, stepTo) {
		leg.joinSegment.origin = Point.add(segment.origin, Point.scale(normalVector, leg.joinSegment.distanceFromPrev));
		const fromTarget = Point.magnitude(Point.subtract(leg.standsOn, leg.joinSegment.origin));

		const bodyLegAngle = Math.abs(Point.angleOfVectors(frontVector, Point.subtract(leg.joinSegment.origin, leg.joinSegment.nextSegment.origin)));

		if (fromTarget > leg.range || bodyLegAngle < 30)
			leg.standsOn = OneLeg.getNewTarget(leg, frontVector, normalVector, stepTo);

		OneLeg.draw(leg, color);
	}

	draw() {
		const frontVector = Point.normalize(Segment.getFrontVector(this.segment));

		Leg.drawOne(this.segment, frontVector, Point.normalRight(frontVector), this.left, this.color, this.stepTo);
		Leg.drawOne(this.segment, frontVector, Point.normalLeft(frontVector), this.right, this.color, this.stepTo);
	}
}