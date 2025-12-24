import * as bezierLine from './bezierLine.js';
import Color from './Color.js';
import Point from './Point.js';
import Segment from './Segment.js';
import {
	AntennaSegmentDescriptor,
	LegSegmentDescriptor,
	SegmentDescriptor
} from './Descriptor.js';

/** Describes a bodypart of a creature. */
export class Bodypart {
	/** Render on top. */
	static TOP = true;
	/** Render on bottom. */
	static BOTTOM = false;

	/**
	 * Creates a Bodypart object.
	 * @param {Segment} segment The parent segment.
	 * @param {boolean} render Where to render.
	 * @param {Color} color Color of the bodypart.
	 */
	constructor(segment, render, color) {
		this.segment = segment;
		this.render = render;
		this.color = color;
	}

	/** Draws this bodypart instance. */
	draw() { }
}

/** Describes one pair of eyes of a creature. */
export class Eye extends Bodypart {
	/**
	 * Creates an Eye object.
	 * @param {Segment} segment The parent segment.
	 * @param {boolean} render Where to render.
	 * @param {number} angleToFront The angle of the eye from the front vector of the segment.
	 * @param {number} distanceToOrigin The distance of the eye from the center of the segment.
	 * @param {number} radius Radius of the eye.
	 * @param {Color} color Color of the eye.
	 */
	constructor(segment, render, angleToFront, distanceToOrigin, radius, color) {
		super(segment, render, color);

		this.radianToFront = radians(angleToFront);
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
	}

	/** Draws this eye instance. */
	draw() {
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		const frontScaled = Point.scale(Segment.getFrontVector(this.segment), this.distanceToOrigin);

		const eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, this.radianToFront));
		ellipse(eyePoint.x, eyePoint.y, this.radius, this.radius);

		const eyePointMirrored = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, -this.radianToFront));
		ellipse(eyePointMirrored.x, eyePointMirrored.y, this.radius, this.radius);
	}
}

/** Describes a pair of fins of a creature. */
export class SideFin extends Bodypart {
	constructor(segment, render, length, width, angle, color) {
		super(segment, render, color);

		this.length = length;
		this.width = width;
		this.angle = angle;
	}

	/**
	 * Draws an ellipse.
	 * @param {Point} position The position of the ellipse.
	 * @param {number} angle The angle of the ellipse.
	 * @param {number} width The width of the ellipse.
	 * @param {number} height The height of the ellipse.
	 */
	static drawEllipseByOrientation(position, angle, width, height) {
		translate(position.x, position.y);
		rotate(radians(angle));

		ellipse(0, -(height / 2), width, height);

		resetMatrix();
	}

	/** Draws this fin instance. */
	draw() {
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		const front = Segment.getFrontVector(this.segment);
		const frontAngle = Point.angleOfVector(Point.normalRight(front));

		const originOne = Point.add(this.segment.origin, Point.normalLeft(front));
		SideFin.drawEllipseByOrientation(originOne, frontAngle - this.angle, this.width, this.length);

		const originTwo = Point.add(this.segment.origin, Point.normalRight(front));
		SideFin.drawEllipseByOrientation(originTwo, frontAngle + this.angle, this.width, this.length);
	}
}

/** Describes the back fin of a creature. */
export class BackFin extends Bodypart {
	/**
	 * Creates a BackFin object.
	 * @param {Segment} segment The parent segment.
	 * @param {boolean} render Where to render.
	 * @param {number} lengthInSegments The number of segments the fin will go through.
	 * @param {Color} color Color of the bodypart.
	 */
	constructor(segment, render, lengthInSegments, color) {
		super(segment, render, color);

		if (lengthInSegments < 2)
			throw "A backfin must have a length of 2 or more!";

		this.lengthInSegments = lengthInSegments;
	}

	/**
	 * Calculates the outline points of the fin.
	 * @param {BackFin} fin The fin to calculate with.
	 * @returns The calculated points.
	 */
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

	/** Draws this fin instance. */
	draw() {
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		bezierLine.drawLoop(BackFin.getPoints(this));
	}
}

/** Describes the tail fin of a creature. */
export class TailFin extends Bodypart {
	/**
	 * Creates a TailFin object.
	 * @param {Segment} segment The parent segment.
	 * @param {boolean} render Where to render.
	 * @param {number[]} distances The distances between the segments of the fin.
	 * @param {Color} color Color of the bodypart.
	 */
	constructor(segment, render, distances, color) {
		super(segment, render, color);

		if (distances.length < 2)
			throw "A tailfin must have at least 2 distance descriptors!";

		const descriptors = [new SegmentDescriptor(1, 1, undefined)];
		for (const distance of distances)
			descriptors.push(new SegmentDescriptor(distance, 1, undefined));

		this.headJoint = Segment.createAndLink(segment.origin, descriptors);
	}

	/**
	 * Calculates the outline points of the fin.
	 * @param {BackFin} fin The fin to calculate with.
	 * @returns The calculated points.
	 */
	static getPoints(fin) {
		const points = [];

		for (const nextSegment of fin.headJoint)
			points.push(nextSegment.origin);

		const angle = Point.sinOfPoints(points[points.length - 3], points[points.length - 2], points[points.length - 1]);
		const magicMultiplier = (13 * angle) / (points.length - 1);

		for (let index = points.length - 1; index > 0; --index) {
			const topPoint = Point.normalRight(Point.subtract(points[index - 1], points[index]));
			points.push(Point.add(points[index], Point.multiply(topPoint, index * magicMultiplier)));
		}

		return points;
	}

	/** Draws this fin instance. */
	draw() {
		this.headJoint.origin = this.segment.origin;
		Segment.pullNext(this.headJoint);

		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		bezierLine.drawLoop(TailFin.getPoints(this));
	}
}

/** Describes a pair of antennas of a creature. */
export class Antenna extends Bodypart {
	/**
	 * Creates a TailFin object.
	 * @param {Segment} segment The parent segment.
	 * @param {boolean} render Where to render.
	 * @param {AntennaSegmentDescriptor} descriptors The descriptors of the segments of the antenna.
	 * @param {number} angle The angle of the antennas.
	 * @param {Color} color Color of the bodypart.
	 */
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

	/**
	 * Draws a loop.
	 * @param {Point} position The position of the loop.
	 * @param {number} angle The angle of the loop.
	 * @param {Point[]} points The points of the loop.
	 */
	static drawLoopByOrientation(position, angle, points) {
		translate(position.x, position.y);
		rotate(radians(angle));

		bezierLine.drawLoop(points);

		resetMatrix();
	}

	/** Draws this antenna instance. */
	draw() {
		fill(this.color.r, this.color.g, this.color.b, this.color.a);

		const bodyAngle = Point.angleOfVector(Point.reverse(Segment.getFrontVector(this.segment)));

		if (this.pointsMirrored instanceof Array) {
			Antenna.drawLoopByOrientation(this.segment.origin, bodyAngle + this.angle, this.points);
			Antenna.drawLoopByOrientation(this.segment.origin, bodyAngle - this.angle, this.pointsMirrored);
		}
		else
			Antenna.drawLoopByOrientation(this.segment.origin, bodyAngle, this.points);
	}
}

/** Describes one leg of a creature. */
class OneLeg {
	/**
	 * Creates a OneLeg object.
	 * @param {Point} origin The origin of the parent segment.
	 * @param {LegSegmentDescriptor[]} descriptors The descriptors of the segments of the leg.
	 */
	constructor(origin, descriptors) {
		this.headSegment = Segment.createAndLink(origin, descriptors);

		let counter = 0;
		let tail = null;
		for (const nextSegment of this.headSegment) {
			++counter;
			tail = nextSegment;
		}

		if (counter < 2)
			throw "A leg must have at least 2 segment descriptors!";

		this.tailSegment = tail;
		this.standsOn = this.tailSegment.origin;

		this.range = Point.distance(this.tailSegment.origin, this.headSegment.origin);
	}

	/**
	 * Gets a new step location for the given leg.
	 * @param {OneLeg} leg The leg to get a new target for.
	 * @param {Point} frontVector The normalized front vector of the parent segment.
	 * @param {Point} normalVector The normalized normal vector of the parent segment pointing torwards the legs direction.
	 * @param {Point} stepStyler The direction vector to calculate the location of the next step.
	 * @returns The new location to step to.
	 */
	static getNewTarget(leg, frontVector, normalVector, stepStyler) {
		const toSide = Point.multiply(normalVector, stepStyler.x);
		const toFront = Point.multiply(frontVector, stepStyler.y);
		const direction = Point.add(toSide, toFront);

		return Point.add(leg.headSegment.origin, (Point.magnitude(direction) > leg.range ? Point.scale(direction, leg.range) : direction));
	}

	/**
	 * Performs two way inverse kinematics on the given leg.
	 * @param {OneLeg} leg The given leg.
	 */
	static twoWayKinematics(leg) {
		const joinPoint = leg.headSegment.origin;

		leg.tailSegment.origin = leg.standsOn;
		Segment.pullPrev(leg.tailSegment);

		leg.headSegment.origin = joinPoint;
		Segment.pullNext(leg.headSegment);
	}

	/**
	 * Mirrors the position of the points of the leg around a certain point.
	 * @param {Point} origin The point to mirror around.
	 * @param {OneLeg} leg The given leg.
	 */
	static break(origin, leg) {
		for (const segment of leg.headSegment)
			segment.origin = Point.subtract(Point.multiply(origin, 2), segment.origin);
	}

	/**
	 * Draws a OneLeg instance.
	 * @param {OneLeg} leg The leg to draw.
	 * @param {Color} color The color of the leg.
	 */
	static draw(leg, color) {
		OneLeg.twoWayKinematics(leg);

		const distanceFromTarget = Point.magnitude(Point.subtract(leg.standsOn, leg.tailSegment.origin));

		if (distanceFromTarget > leg.tailSegment.distanceFromPrev) {
			OneLeg.break(leg.headSegment.origin, leg);

			for (let i = 0; i < 5; ++i)
				OneLeg.twoWayKinematics(leg);
		}

		for (const segment of leg.headSegment)
			Segment.drawBodyparts(segment, Bodypart.BOTTOM);

		fill(color.r, color.g, color.b, color.a);

		bezierLine.drawLoop(Segment.getPoints(leg.headSegment));

		for (const segment of leg.headSegment)
			Segment.drawBodyparts(segment, Bodypart.TOP);
	}
}

/** Describes one pair of legs of a creature. */
export class Leg extends Bodypart {
	/**
	 * Creates a Leg object.
	 * @param {Segment} segment The parent segment.
	 * @param {boolean} render Where to render.
	 * @param {LegSegmentDescriptor[]} descriptors The descriptors of the segments of one leg.
	 * @param {Point} stepTo Point to step on.
	 * @param {Color} color The color of the legs.
	 */
	constructor(segment, render, descriptors, stepTo, color) {
		super(segment, render, color);

		this.left = new OneLeg(segment.origin, descriptors);

		const mirroreddescriptors = [];
		for (const descriptor of descriptors)
			mirroreddescriptors.push(LegSegmentDescriptor.mirror(descriptor));
		this.right = new OneLeg(segment.origin, mirroreddescriptors);

		this.stepTo = stepTo;
	}

	/**
	 * Draws one leg.
	 * @param {Segment} segment The parent segment.
	 * @param {Point} frontVector The normalized front vector of the parent segment.
	 * @param {Point} normalVector The normalized normal vector of the parent segment pointing torwards the legs direction.
	 * @param {OneLeg} leg The leg to draw.
	 * @param {Color} color The color of the leg.
	 * @param {Point} stepTo Point to step on.
	 */
	static drawOne(segment, frontVector, normalVector, leg, color, stepTo) {
		leg.headSegment.origin = Point.add(segment.origin, Point.scale(normalVector, leg.headSegment.distanceFromPrev));

		const distanceFromTarget = Point.distance(leg.standsOn, leg.headSegment.origin);
		const bodyLegAngle = Math.abs(Point.angleOfVectors(frontVector, Point.subtract(leg.headSegment.origin, leg.headSegment.nextSegment.origin)));

		if (distanceFromTarget > leg.range || bodyLegAngle < 30)
			leg.standsOn = OneLeg.getNewTarget(leg, frontVector, normalVector, stepTo);

		OneLeg.draw(leg, color);
	}

	/** Draws this leg instance. */
	draw() {
		const normalizedFrontVector = Point.normalize(Segment.getFrontVector(this.segment));

		Leg.drawOne(this.segment, normalizedFrontVector, Point.normalRight(normalizedFrontVector), this.left, this.color, this.stepTo);
		Leg.drawOne(this.segment, normalizedFrontVector, Point.normalLeft(normalizedFrontVector), this.right, this.color, this.stepTo);
	}
}