import Color from './Color.js';
import Point from './Point.js';
import Segment from './Segment.js';
import Animal from './Animal.js';
import { Eye, BackFin, SideFin, TailFin, Bodypart, Antenna, Leg } from './Bodypart.js';

/** Describes an animal. */
export class AnimalDescriptor {
	/**
	 * Creates an AnimalDescriptor object.
	 * @param {Point} headPosition The head starting position.
	 * @param {SegmentDescriptor[]} segmentDescriptors The segments of the animal.
	 * @param {number} turnAngle The maximum angle the animal can turn with.
	 * @param {Color} color The color of the body.
	 * @param {number} speed The speed of the animal.
	 */
	constructor(headPosition, segmentDescriptors, turnAngle, color, speed) {
		this.headPosition = headPosition;
		this.segmentDescriptors = segmentDescriptors;
		this.turnAngle = turnAngle;
		this.color = color;
		this.speed = speed;
	}

	/**
	 * Creates an Animal object by this descriptor.
	 * @returns The Animal object.
	 */
	create() {
		return new Animal(this.headPosition, this.segmentDescriptors, this.turnAngle, this.color, this.speed);
	}
}

export class SegmentDescriptor {
	/**
	 * Creates a SegmentDescriptor object.
	 * @param {number} segmentDistance The distance form the previous segment.
	 * @param {number} skinRadius The radius of the skin at the segment.
	 * @param {BodypartDescriptor[]} bodypartDescriptors The bodyparts of the segment.
	 */
	constructor(segmentDistance, skinRadius, bodypartDescriptors = undefined) {
		this.segmentDistance = segmentDistance;
		this.skinRadius = Math.abs(skinRadius);
		this.bodypartDescriptors = bodypartDescriptors;
	}

	/**
	 * Creates a Segment object by this descriptor.
	 * @returns The Segment object.
	 */
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
	/**
	 * Creates a BodypartDescriptor object.
	 * @param {boolean} render Where to render.
	 * @param {Color} color The color of the bodypart.
	 */
	constructor(render, color) {
		this.render = render;
		this.color = color;
	}

	/**
	 * Creates a Bodypart object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The Bodypart object.
	 */
	create(segment) { throw "This function must be implemented in an inherited class!"; }
}

export class EyeDescriptor extends BodypartDescriptor {
	/**
	 * Creates an EyeDescriptor object.
	 * @param {number} angleToFront The angle to push the eye from the center of the segment.
	 * @param {number} distanceToOrigin The distance to push the eye from the center of the segment.
	 * @param {number} radius The radius of the eye.
	 * @param {Color} color The color of the bodypart.
	 * @param {boolean} render Where to render.
	 */
	constructor(angleToFront, distanceToOrigin, radius, color, render = Bodypart.TOP) {
		super(render, color);

		this.degreeToFront = Math.abs(angleToFront);
		this.distanceToOrigin = Math.abs(distanceToOrigin);
		this.radius = Math.abs(radius);
	}

	/**
	 * Creates an Eye object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The Eye object.
	 */
	create(segment) { return new Eye(segment, this.render, this.degreeToFront, this.distanceToOrigin, this.radius, this.color); }
}

export class SideFinDescriptor extends BodypartDescriptor {
	/**
	 * Creates a SideFinDescriptor object.
	 * @param {number} length The length of the fin.
	 * @param {number} width The width of the fin.
	 * @param {number} angle The angle of the fin.
	 * @param {Color} color The color of the fin.
	 * @param {boolean} render Where to render.
	 */
	constructor(length, width, angle, color, render = Bodypart.BOTTOM) {
		super(render, color);

		this.length = Math.abs(length);
		this.width = Math.abs(width);
		this.angle = angle;
	}

	/**
	 * Creates a SideFin object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The SideFin object.
	 */
	create(segment) { return new SideFin(segment, this.render, this.length, this.width, this.angle, this.color); }
}

export class BackFinDescriptor extends BodypartDescriptor {
	/**
	 * Creates a BackFinDescriptor object.
	 * @param {number} lengthInSegments The number of segments the fin will go through.
	 * @param {Color} color The color of the fin.
	 * @param {boolean} render Where to render.
	 */
	constructor(lengthInSegments, color, render = Bodypart.TOP) {
		super(render, color);

		this.lengthInSegments = lengthInSegments;
	}

	/**
	 * Creates a BackFin object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The BackFin object.
	 */
	create(segment) { return new BackFin(segment, this.render, this.lengthInSegments, this.color); }
}

export class TailFinDescriptor extends BodypartDescriptor {
	/**
	 * Creates a TailFinDescriptor object.
	 * @param {number[]} segmentDistances The distances of the segments of the fin.
	 * @param {Color} color The color of the fin.
	 * @param {boolean} render Where to render.
	 */
	constructor(segmentDistances, color, render = Bodypart.BOTTOM) {
		super(render, color);

		this.segmentDistances = segmentDistances;
	}

	/**
	 * Creates a TailFin object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The TailFin object.
	 */
	create(segment) { return new TailFin(segment, this.render, this.segmentDistances, this.color); }
}

export class AntennaDescriptor extends BodypartDescriptor {
	/**
	 * Creates an AntennaDescriptor object.
	 * @param {AntennaSegmentDescriptor[]} antennaSegmentDescriptors The segments of the antenna.
	 * @param {number} angle The angle to push the eye from the center of the segment.
	 * @param {Color} color The color of the antenna.
	 * @param {boolean} render Where to render.
	 */
	constructor(antennaSegmentDescriptors, angle, color, render = Bodypart.TOP) {
		super(render, color);

		this.segmentDescriptors = antennaSegmentDescriptors;
		this.angle = angle;
	}

	/**
	 * Creates an Antenna object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The Antenna object.
	 */
	create(segment) { return new Antenna(segment, this.render, this.segmentDescriptors, this.angle, this.color); }
}

export class AntennaSegmentDescriptor extends SegmentDescriptor {
	/**
	 * Creates an AntennaSegmentDescriptor object.
	 * @param {number} segmentDistance The distance form the previous segment.
	 * @param {number} skinRadius The radius of the skin at the segment.
	 * @param {number} angle The angle of the segment from the previous one.
	 */
	constructor(segmentDistance, skinRadius, angle) {
		super(segmentDistance, skinRadius);

		this.angle = angle;
	}

	/**
	 * Creates a Segment object by this descriptor.
	 * @param {Point} prevOrigin The origin of the previous segment.
	 * @returns The Segment object.
	 */
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
	/**
	 * Creates a LegDescriptor object.
	 * @param {LegSegmentDescriptor[]} legSegmentDescriptors The segments of the leg.
	 * @param {Point} stepTo The position to step to.
	 * @param {Color} color The color of the leg.
	 * @param {boolean} render Where to render.
	 */
	constructor(legSegmentDescriptors, stepTo, color, render = Bodypart.BOTTOM) {
		super(render, color);

		this.segmentDescriptors = legSegmentDescriptors;
		this.stepTo = stepTo;
	}

	/**
	 * Creates a Leg object by this descriptor.
	 * @param {Segment} segment The parent segment.
	 * @returns The Leg object.
	 */
	create(segment) { return new Leg(segment, this.render, this.segmentDescriptors, this.stepTo, this.color); }
}

export class LegSegmentDescriptor extends SegmentDescriptor {
	/**
	 * Creates a LegSegmentDescriptor object.
	 * @param {number} segmentDistance The distance form the previous segment.
	 * @param {number} skinRadius The radius of the skin at the segment.
	 * @param {number} minAngle The minimum angle of the joint.
	 * @param {number} maxAngle The maximum angle of the joint.
	 * @param {BodypartDescriptor[]} bodypartDescriptors The bodyparts of the segment.
	 */
	constructor(segmentDistance, skinRadius, minAngle, maxAngle, bodypartDescriptors = null) {
		super(segmentDistance, skinRadius, bodypartDescriptors);

		if (this.minAngle > this.maxAngle)
			throw "maxAngle should be bigger or equal than minAngle!"

		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
	}

	/**
	 * Mirrors the position one LegSegmentDescriptor.
	 * @param {LegSegmentDescriptor} descriptor The LegSegmentDescriptor to mirror.
	 * @returns A new LegSegmentDescriptor object with mirrored coordinates. 
	 */
	static mirror(descriptor) {
		return new LegSegmentDescriptor(
			-descriptor.segmentDistance,
			descriptor.skinRadius,
			-descriptor.maxAngle,
			-descriptor.minAngle,
			descriptor.bodypartDescriptors
		);
	}

	/**
	 * Creates a Segment object by this descriptor.
	 * @param {Point} prevOrigin The origin of the previous segment.
	 * @returns The Segment object.
	 */
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