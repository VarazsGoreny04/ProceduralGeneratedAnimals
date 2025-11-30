class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static add(a, b) {
		return new Point(a.x + b.x, a.y + b.y);
	}

	static subtract(a, b) {
		return new Point(a.x - b.x, a.y - b.y);
	}

	static multiply(v, s) {
		return new Point(v.x * s, v.y * s);
	}

	static divide(v, s) {
		return new Point(v.x / s, v.y / s);
	}

	static magnitude(v) {
		return Math.sqrt(v.x ** 2 + v.y ** 2);
	}

	static distance(a, b) {
		return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
	}

	static normalize(v) {
		return Point.divide(v, Point.magnitude(v));
	}

	static normalLeft(v) {
		return new Point(-v.y, v.x);
	}

	static normalRight(v) {
		return new Point(v.y, -v.x);
	}

	static rotateRadian(v, radian) {
		return new Point(cos(radian) * v.x - sin(radian) * v.y, sin(radian) * v.x + cos(radian) * v.y);
	}

	static rotateDegree(v, degree) {
		return Point.rotate(radians(v, degree));
	}

	static mouse() {
		return new Point(mouseX, mouseY);
	}
}

class Bodypart {
	constructor(segment) {
		this.segment = segment;
	}

	draw() { }
}

class Eye extends Bodypart {
	constructor(segment, degreeToFront, distanceToOrigin, radius, color) {
		super(segment);
		this.radianToFront = radians(degreeToFront);
		this.distanceToOrigin = distanceToOrigin;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		fill(this.color.r, this.color.g, this.color.b);

		const frontScaled = Point.multiply(Point.normalize(Segment.getFrontVector(this.segment)), this.distanceToOrigin);

		let eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, this.radianToFront));
		ellipse(eyePoint.x, eyePoint.y, this.radius, this.radius);

		eyePoint = Point.add(this.segment.origin, Point.rotateRadian(frontScaled, -this.radianToFront));
		ellipse(eyePoint.x, eyePoint.y, this.radius, this.radius);
	}
}

class Leg extends Bodypart {
	constructor(segment) {
		super(segment);
	}
}

class Segment {
	constructor(prevSegment, nextSegment, origin, segmentDistance, skinRadius, bodypart) {
		this.prevSegment = prevSegment;
		this.nextSegment = nextSegment;
		this.origin = origin;
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;
		this.bodypart = bodypart;
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

	static pullNext(segment) {
		if (segment.nextSegment instanceof Segment) {
			const vector = Point.subtract(segment.nextSegment.origin, segment.origin);

			segment.nextSegment.origin = Point.add(segment.origin, Point.multiply(Point.normalize(vector), segment.nextSegment.segmentDistance));

			Segment.pullNext(segment.nextSegment);
		}
	}

	static getFrontVector(segment) {
		let prev = segment.prevSegment;
		let next = segment.nextSegment;

		if (!(prev instanceof Segment || next instanceof Segment))
			throw "Not enough segments!";

		if (!(prev instanceof Segment))
			prev = segment;
		if (!(next instanceof Segment))
			next = segment;

		const vector = Point.subtract(prev.origin, next.origin);

		return Point.multiply(Point.normalize(vector), segment.skinRadius);
	}
}

class SegmentDiscriptor {
	constructor(nextSegmentDistance, skinRadius, bodypart = undefined) {
		this.nextSegmentDistance = nextSegmentDistance;
		this.skinRadius = skinRadius;
		this.bodypart = bodypart;
	}
}

class Animal {
	constructor(headPosition, radiusDiscriptors, bodyColor) {
		this.headSegment = setupAnimal(headPosition, radiusDiscriptors);
		this.bodyColor = bodyColor;
	}

	step(speedInPixels) {
		Segment.step(this.headSegment, speedInPixels);
	}
}

function setupAnimal(startingPoint, segmentDiscriptors) {
	const result = new Segment(
		undefined,
		undefined,
		startingPoint,
		segmentDiscriptors[0].nextSegmentDistance,
		segmentDiscriptors[0].skinRadius,
		segmentDiscriptors[0].bodypart
	);
	if (result.bodypart instanceof Bodypart)
		result.bodypart.segment = result;

	let current = result;
	let next;

	for (let index = 1; index < segmentDiscriptors.length; ++index) {
		next = new Segment(
			current,
			undefined,
			new Point(current.origin.x - segmentDiscriptors[index].nextSegmentDistance, current.origin.y),
			segmentDiscriptors[index].nextSegmentDistance,
			segmentDiscriptors[index].skinRadius,
			segmentDiscriptors[index].bodypart
		);
		if (next.bodypart instanceof Bodypart)
			next.bodypart.segment = next;

		current.nextSegment = next;
		current = next;
	}

	return result
}

function drawAnimalByCircles(headSegment) {
	// console.log("Head");
	for (const segment of headSegment) {
		// console.log(segment.origin);
		ellipse(segment.origin.x, segment.origin.y, segment.skinRadius * 2);
	}
}

function getPointsOfAnimal(headSegment) {
	const angleInRadian = radians(45);

	const front = Segment.getFrontVector(headSegment);

	const left = [Point.add(headSegment.origin, front), Point.add(headSegment.origin, Point.rotateRadian(front, angleInRadian))];
	const right = [Point.add(headSegment.origin, Point.rotateRadian(front, -angleInRadian))];

	let end;

	for (const segment of headSegment) {
		let front = Segment.getFrontVector(segment);

		left.push(Point.add(segment.origin, Point.normalLeft(front)));
		right.push(Point.add(segment.origin, Point.normalRight(front)));

		end = segment;
	}

	let back = Segment.getFrontVector(end);
	back = new Point(-back.x, -back.y);

	/* 
	left.push(Point.add(end.origin, Point.rotateRadian(back, -angleInRadian)));
	right.push(Point.add(end.origin, Point.rotateRadian(back, angleInRadian)));
	*/

	left.push(Point.add(end.origin, back));

	return left.reverse().concat(right);
}


function drawAnimalByPoints(animal) {
	fill(animal.bodyColor.r, animal.bodyColor.g, animal.bodyColor.b);

	drawLoop(getPointsOfAnimal(animal.headSegment));
}

function drawLoop(points) {
	beginShape();
	curveVertex(points[0].x, points[0].y);
	for (const point of points)
		curveVertex(point.x, point.y);
	curveVertex(points[0].x, points[0].y);
	curveVertex(points[0].x, points[0].y);
	endShape();
}

function animationLoop(animal, speedInPixels) {
	background(20, 80, 20);

	animal.step(speedInPixels);

	drawAnimalByPoints(animal);
	// drawAnimalByCircles(animal);

	for (const segment of animal.headSegment) {
		if (segment.bodypart instanceof Bodypart)
			segment.bodypart.draw();
	}
}

function setup() {
	strokeCap(ROUND);
	strokeJoin(ROUND);
	stroke(0);
	createCanvas(1600, 800);

	const lizard = [
		new SegmentDiscriptor(undefined, 26, new Eye(undefined, 115, 22, 10, new Color(0, 0, 0))),
		new SegmentDiscriptor(26, 29),
		new SegmentDiscriptor(29, 20),
		new SegmentDiscriptor(22, 30),
		new SegmentDiscriptor(33, 34),
		new SegmentDiscriptor(27, 36),
		new SegmentDiscriptor(32, 32),
		new SegmentDiscriptor(25, 25),
		new SegmentDiscriptor(30, 14),
		new SegmentDiscriptor(25, 8),
		new SegmentDiscriptor(25, 6),
		new SegmentDiscriptor(25, 5),
		new SegmentDiscriptor(25, 4),
		new SegmentDiscriptor(25, 4),
	];
	const snake = [
		new SegmentDiscriptor(undefined, 26, new Eye(undefined, 115, 22, 10, new Color(0, 0, 0))),
		new SegmentDiscriptor(26, 29),
		new SegmentDiscriptor(29, 23),
		new SegmentDiscriptor(22, 22),
		new SegmentDiscriptor(22, 22),
		new SegmentDiscriptor(22, 22),
		new SegmentDiscriptor(22, 22),
		new SegmentDiscriptor(22, 21),
		new SegmentDiscriptor(22, 21),
		new SegmentDiscriptor(22, 21),
		new SegmentDiscriptor(22, 21),
		new SegmentDiscriptor(22, 20),
		new SegmentDiscriptor(22, 20),
		new SegmentDiscriptor(22, 20),
		new SegmentDiscriptor(22, 20),
		new SegmentDiscriptor(22, 19),
		new SegmentDiscriptor(22, 19),
		new SegmentDiscriptor(22, 19),
		new SegmentDiscriptor(22, 19),
		new SegmentDiscriptor(22, 18),
		new SegmentDiscriptor(22, 18),
		new SegmentDiscriptor(22, 18),
		new SegmentDiscriptor(22, 18),
		new SegmentDiscriptor(22, 17),
		new SegmentDiscriptor(22, 17),
		new SegmentDiscriptor(22, 17),
		new SegmentDiscriptor(22, 17),
		new SegmentDiscriptor(22, 16),
		new SegmentDiscriptor(22, 16),
		new SegmentDiscriptor(22, 16),
		new SegmentDiscriptor(22, 16),
		new SegmentDiscriptor(22, 15),
		new SegmentDiscriptor(22, 15),
		new SegmentDiscriptor(22, 15),
		new SegmentDiscriptor(22, 15),
		new SegmentDiscriptor(22, 14),
		new SegmentDiscriptor(22, 14),
		new SegmentDiscriptor(22, 14),
		new SegmentDiscriptor(22, 13),
		new SegmentDiscriptor(22, 13),
		new SegmentDiscriptor(22, 13),
		new SegmentDiscriptor(22, 12),
		new SegmentDiscriptor(22, 12),
		new SegmentDiscriptor(22, 12),
		new SegmentDiscriptor(22, 11),
		new SegmentDiscriptor(22, 11),
		new SegmentDiscriptor(22, 11),
		new SegmentDiscriptor(22, 10),
		new SegmentDiscriptor(22, 10),
		new SegmentDiscriptor(22, 10),
		new SegmentDiscriptor(22, 9),
		new SegmentDiscriptor(22, 9),
		new SegmentDiscriptor(22, 9),
		new SegmentDiscriptor(22, 8),
		new SegmentDiscriptor(22, 8),
		new SegmentDiscriptor(22, 7),
		new SegmentDiscriptor(22, 7),
		new SegmentDiscriptor(22, 6),
		new SegmentDiscriptor(22, 5),
		new SegmentDiscriptor(22, 4),
	];
	const test = [
		new SegmentDiscriptor(undefined, 52),
		new SegmentDiscriptor(26, 58)
	];

	const FPS = 60;
	const speedInPixels = 10;
	const animal = new Animal(new Point(1200, 300), snake, new Color(10, 190, 10));

	setInterval(() => { animationLoop(animal, speedInPixels); }, Math.floor(1000 / FPS));
}