import Point from './Point.js';
import Segment from './Segment.js';
import Animal from './Animal.js';
import { Eye, BackFin, SideFin, TailFin, Bodypart, Antenna, Leg } from './Bodypart.js';

export class AnimalDescriptor {
	constructor(headPosition, segmentDescriptors, color) {
		this.headPosition = headPosition;
		this.segmentDescriptors = segmentDescriptors;
		this.color = color;
	}

	create() {
		return new Animal(this.headPosition, this.segmentDescriptors, this.color);
	}
}

export class SegmentDescriptor {
	constructor(segmentDistance, skinRadius, bodypartDescriptors = undefined) {
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;
		this.bodypartDescriptors = bodypartDescriptors;
	}

	create(prevOrigin) {
		const segment = new Segment(
			new Point(prevOrigin.x - this.segmentDistance, prevOrigin.y),
			this.segmentDistance,
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
		this.degreeToFront = degreeToFront;
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
	}

	create(segment) { return new Eye(segment, this.render, this.degreeToFront, this.distanceToOrigin, this.radius, this.color); }
}

export class SideFinDescriptor extends BodypartDescriptor {
	constructor(length, width, angle, color, render = Bodypart.BOTTOM) {
		super(render, color);
		this.length = length;
		this.width = width;
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
	constructor(segmentDistance, skinRadius, angle, bodypartDescriptor = null) {
		super(segmentDistance, skinRadius, bodypartDescriptor);
		this.angle = angle;
	}

	create(prevOrigin) {
		const segment = new Segment(
			Point.rotateDegree(new Point(prevOrigin.x - this.segmentDistance, prevOrigin.y), this.angle),
			this.segmentDistance,
			this.skinRadius,
			null
		);

		if (this.bodypartDescriptors instanceof BodypartDescriptor)
			segment.bodyparts = this.bodypartDescriptors.create(segment);

		return segment;
	}
}

export class LegDescriptor extends BodypartDescriptor {
	constructor(legSegmentDescriptors, color, render = Bodypart.TOP) {
		super(render, color);
		this.segmentDescriptors = legSegmentDescriptors;
	}

	create(segment) { return new Leg(segment, this.render, this.segmentDescriptors, this.color); }
}

export class LegSegmentDescriptor extends SegmentDescriptor {
	constructor(segmentDistance, skinRadius, minAngle, maxAngle, bodypartDescriptor = null) {
		super(segmentDistance, skinRadius, bodypartDescriptor);
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
	}

	create(prevOrigin) {
		const segment = new Segment(
			new Point(prevOrigin.x, prevOrigin.y + this.segmentDistance),
			this.segmentDistance,
			this.skinRadius,
			null
		);

		segment.maxAngle = this.maxAngle;
		segment.minAngle = this.minAngle;

		if (this.bodypartDescriptors instanceof BodypartDescriptor)
			segment.bodyparts = this.bodypartDescriptors.create(segment);

		return segment;
	}
}