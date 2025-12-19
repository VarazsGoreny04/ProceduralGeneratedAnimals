import Point from './Point.js';
import Segment from './Segment.js';
import Animal from './Animal.js';
import { Eye, BackFin, SideFin, TailFin, Bodypart, Antenna, Leg } from './Bodypart.js';

export class AnimalDescriptor {
	constructor(headPosition, segmentDescriptors, turnAngle, color, speed) {
		this.headPosition = headPosition;
		this.segmentDescriptors = segmentDescriptors;
		this.turnAngle = turnAngle;
		this.color = color;
		this.speed = speed;
	}

	create() {
		return new Animal(this.headPosition, this.segmentDescriptors, this.turnAngle, this.color, this.speed);
	}
}

export class SegmentDescriptor {
	constructor(segmentDistance, skinRadius, bodypartDescriptors = undefined) {
		this.segmentDistance = segmentDistance;
		this.skinRadius = Math.abs(skinRadius);
		this.bodypartDescriptors = bodypartDescriptors;
	}

	create(prevOrigin) {
		const segment = new Segment(
			new Point(prevOrigin.x - this.segmentDistance, prevOrigin.y),
			Math.abs(this.segmentDistance),
			this.skinRadius,
			null
		);

		if (this.bodypartDescriptors instanceof Array) {
			segment.bodyparts = [];

			for (const bodypartDescriptor of this.bodypartDescriptors)
				segment.bodyparts.push(bodypartDescriptor.create(segment));
		}

		return segment;
	}
}

export class BodypartDescriptor {
	constructor(render, color) {
		this.render = render;
		this.color = color;
	}

	create(segment) { throw "This function must be implemented in an inherited class!"; }
}

export class EyeDescriptor extends BodypartDescriptor {
	constructor(degreeToFront, distanceToOrigin, radius, color, render = Bodypart.TOP) {
		super(render, color);

		this.degreeToFront = Math.abs(degreeToFront);
		this.distanceToOrigin = Math.abs(distanceToOrigin);
		this.radius = Math.abs(radius);
	}

	create(segment) { return new Eye(segment, this.render, this.degreeToFront, this.distanceToOrigin, this.radius, this.color); }
}

export class SideFinDescriptor extends BodypartDescriptor {
	constructor(length, width, angle, color, render = Bodypart.BOTTOM) {
		super(render, color);

		this.length = Math.abs(length);
		this.width = Math.abs(width);
		this.angle = angle;
	}

	create(segment) { return new SideFin(segment, this.render, this.length, this.width, this.angle, this.color); }
}

export class BackFinDescriptor extends BodypartDescriptor {
	constructor(lengthInSegments, color, render = Bodypart.TOP) {
		super(render, color);

		this.lengthInSegments = lengthInSegments;
	}

	create(segment) { return new BackFin(segment, this.render, this.lengthInSegments, this.color); }
}

export class TailFinDescriptor extends BodypartDescriptor {
	constructor(segmentDescriptors, color, render = Bodypart.BOTTOM) {
		super(render, color);

		this.segmentDescriptors = segmentDescriptors;
	}

	create(segment) { return new TailFin(segment, this.render, this.segmentDescriptors, this.color); }
}

export class AntennaDescriptor extends BodypartDescriptor {
	constructor(antennaSegmentDescriptors, angle, color, render = Bodypart.TOP) {
		super(render, color);

		this.segmentDescriptors = antennaSegmentDescriptors;
		this.angle = angle;
	}

	create(segment) { return new Antenna(segment, this.render, this.segmentDescriptors, this.angle, this.color); }
}

export class AntennaSegmentDescriptor extends SegmentDescriptor {
	constructor(segmentDistance, skinRadius, angle) {
		super(segmentDistance, skinRadius);

		this.angle = angle;
	}

	create(prevOrigin) {
		const segment = new Segment(
			Point.rotateDegree(new Point(prevOrigin.x - this.segmentDistance, prevOrigin.y), this.angle),
			this.segmentDistance,
			this.skinRadius,
			null
		);

		return segment;
	}
}

export class LegDescriptor extends BodypartDescriptor {
	constructor(legSegmentDescriptors, stepTo, color, render = Bodypart.BOTTOM) {
		super(render, color);

		this.segmentDescriptors = legSegmentDescriptors;
		this.stepTo = stepTo;
	}

	create(segment) { return new Leg(segment, this.render, this.segmentDescriptors, this.stepTo, this.color); }
}

export class LegSegmentDescriptor extends SegmentDescriptor {
	constructor(segmentDistance, skinRadius, minAngle, maxAngle, bodypartDescriptors = null) {
		super(segmentDistance, skinRadius, bodypartDescriptors);

		this.minAngle = minAngle;
		this.maxAngle = maxAngle;

		if (this.minAngle > this.maxAngle) {
			const temp = this.minAngle;
			this.minAngle = this.maxAngle;
			this.maxAngle = temp;
		}
	}

	static mirror(discriptor) {
		return new LegSegmentDescriptor(
			-discriptor.segmentDistance,
			discriptor.skinRadius,
			-discriptor.maxAngle,
			-discriptor.minAngle,
			discriptor.bodypartDescriptors
		);
	}

	create(prevOrigin) {
		const segment = new Segment(
			new Point(prevOrigin.x, prevOrigin.y - this.segmentDistance),
			Math.abs(this.segmentDistance),
			this.skinRadius,
			null
		);

		segment.maxAngle = this.maxAngle;
		segment.minAngle = this.minAngle;

		if (this.bodypartDescriptors instanceof Array) {
			segment.bodyparts = [];

			for (const bodypartDescriptor of this.bodypartDescriptors)
				segment.bodyparts.push(bodypartDescriptor.create(segment));
		}

		return segment;
	}
}