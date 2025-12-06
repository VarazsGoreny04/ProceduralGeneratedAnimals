import Point from './Point.js';
import Segment from './Segment.js';
import { Eye, BackFin, SideFin, TailFin } from './Bodypart.js';

export class SegmentDiscriptor {
	constructor(segmentDistance, skinRadius, bodypartDiscriptor = undefined) {
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;
		this.bodypartDiscriptor = bodypartDiscriptor;
	}

	create(prevOrigin) {
		const segment = new Segment(
			new Point(prevOrigin.x - this.segmentDistance, prevOrigin.y),
			this.segmentDistance,
			this.skinRadius,
			undefined
		);

		if (this.bodypartDiscriptor instanceof BodypartDiscriptor)
			segment.bodypart = this.bodypartDiscriptor.create(segment);

		return segment;
	}
}

export class BodypartDiscriptor {
	constructor() { }

	create(segment) { return undefined; }
}

export class EyeDiscriptor extends BodypartDiscriptor {
	constructor(degreeToFront, distanceToOrigin, radius, color) {
		super();
		this.degreeToFront = degreeToFront;
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
		this.color = color;
	}

	create(segment) { return new Eye(segment, this.degreeToFront, this.distanceToOrigin, this.radius, this.color); }
}

export class SideFinDiscriptor extends BodypartDiscriptor {
	constructor(length, width, angle, color) {
		super();
		this.length = length;
		this.width = width;
		this.angle = angle;
		this.color = color;
	}

	create(segment) { return new SideFin(segment, this.length, this.width, this.angle, this.color); }
}

export class BackFinDiscriptor extends BodypartDiscriptor {
	constructor(lengthInSegments, color) {
		super();
		this.lengthInSegments = lengthInSegments;
		this.color = color;
	}

	create(segment) { return new BackFin(segment, this.lengthInSegments, this.color); }
}

export class TailFinDiscriptor extends BodypartDiscriptor {
	constructor(segmentDiscriptors, color) {
		super();
		this.segmentDiscriptors = segmentDiscriptors;
		this.color = color;
	}

	create(segment) { return new TailFin(segment, this.segmentDiscriptors, this.color); }
}