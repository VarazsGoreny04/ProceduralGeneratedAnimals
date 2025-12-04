import * as bezierLine from './bezierLine.js';
import Point from './Point.js';
import Segment from './Segment.js';

export class Bodypart {
	static TOP = true;
	static BOTTOM = false;

	constructor(render) {
		this.segment = undefined;
		this.render = render;
	}

	draw() { }
}

export class Eye extends Bodypart {
	constructor(degreeToFront, distanceToOrigin, radius, color) {
		super(Bodypart.BOTTOM);
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
	constructor(length, width, angle, color) {
		super(Bodypart.BOTTOM);
		this.length = length;
		this.width = width;
		this.angle = angle;
		this.color = color;
	}

	static drawEllipseByAngle(x, y, w, h, angle) {
		translate(x, y);
		rotate(radians(angle));
		ellipse(0, 0, w, h);

		resetMatrix()
	}

	draw() {
		const front = Segment.getFrontVector(this.segment);
		const frontAngle = Point.angleOfVectors(new Point(0, 1), front);

		const normalLeft = Point.add(this.segment.origin, Point.normalLeft(front));
		SideFin.drawEllipseByAngle(normalLeft.x, normalLeft.y, this.width, this.length, frontAngle);

		const normalRight = Point.add(this.segment.origin, Point.normalRight(front));
		SideFin.drawEllipseByAngle(normalRight.x, normalRight.y, this.width, this.length, frontAngle);
	}
}

export class BackFin extends Bodypart {
	constructor(lengthInSegments, color) {
		super(Bodypart.TOP);
		this.lengthInSegments = lengthInSegments;
		this.color = color;
	}

	static getFinPoints(fin) {
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

		bezierLine.drawLoop(BackFin.getFinPoints(this));
	}
}

/* class TailFin extends Bodypart {
	constructor(prevSegment, nextSegment, origin, segmentDistance) {
		this.prevSegment = prevSegment;
		this.nextSegment = nextSegment;
		this.origin = origin;
		this.segmentDistance = segmentDistance;
	}

	*[Symbol.iterator]() {
		let current = this;
		while (current) {
			yield current;
			current = current.nextSegment;
		}
	}

	static step(segment, speedInPixels) {
		const vectorToMouse = Point.subtract(Point.mouse(), segment.origin);

		if (Point.magnitude(vectorToMouse) < speedInPixels)
			return;

		const direction = Point.multiply(Point.normalize(vectorToMouse), speedInPixels);

		segment.origin = Point.add(segment.origin, direction);
		Segment.pullNext(segment);
	}
}

class Antenna extends Bodypart {
	constructor(segment, degreeToFront, distanceToOrigin, radius, color) {
		super(segment, Bodypart.BOTTOM);
		this.radianToFront = radians(degreeToFront);
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		const frontScaled = Point.multiply(Point.normalize(Segment.getFrontVector(this.segment)), this.distanceToOrigin);

		let eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, this.radianToFront));

		eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, -this.radianToFront));
	}
}

class Leg extends Bodypart {
	constructor(segment) {
		super(segment, Bodypart.BOTTOM);
	}
} */