class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static add(a, b) {
		return new Point(b.x + a.x, b.y + a.y);
	}

	static subtract(a, b) {
		return new Point(b.x - a.x, b.y - a.y);
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
}

class Bodypart {
	constructor(origin, segmentDistance, skinDistance, nextSegment) {
		this.origin = origin;
		this.segmentDistance = segmentDistance;
		this.skinDistance = skinDistance;
		this.nextSegment = nextSegment;
	}

	*[Symbol.iterator]() {
		let current = this;
		while (current) {
			yield current;
			current = current.nextSegment;
		}
	}

	step(speedInPixels) {
		const mouse = new Point(mouseX, mouseY);
		const vectorToMouse = Point.subtract(this.origin, mouse);

		if (Point.magnitude(vectorToMouse) < speedInPixels)
			return;

		const direction = Point.multiply(Point.normalize(vectorToMouse), speedInPixels);

		this.origin = Point.add(this.origin, direction);
		Bodypart.pullNext(this);
	}

	static pullNext(bodypart) {
		if (bodypart.nextSegment instanceof Bodypart) {
			const vector = Point.subtract(bodypart.origin, bodypart.nextSegment.origin);

			bodypart.nextSegment.origin = Point.add(bodypart.origin, Point.multiply(Point.normalize(vector), bodypart.nextSegment.segmentDistance));

			Bodypart.pullNext(bodypart.nextSegment);
		}
	}
}

class RadiusDiscriptor {
	constructor(segmentDistance, skinRadius) {
		this.segmentDistance = segmentDistance;
		this.skinDistance = skinRadius;
	}
}

function setupAnimal(startingPoint, radiusDiscriptorArray) {
	const result = new Bodypart(startingPoint, radiusDiscriptorArray[0].segmentDistance, radiusDiscriptorArray[0].skinDistance, undefined);
	let current = result;
	let next;

	for (let index = 1; index < radiusDiscriptorArray.length; ++index) {
		next = new Bodypart(
			new Point(current.origin.x - radiusDiscriptorArray[index].segmentDistance, current.origin.y),
			radiusDiscriptorArray[index].segmentDistance,
			radiusDiscriptorArray[index].skinDistance,
			undefined
		);

		current.nextSegment = next;
		current = next;
	}

	return result
}

function drawAnimal(snake) {
	background(100, 100, 100);
	stroke(255);
	fill(0, 0, 0, 0);

	//console.log("Head");
	for (const bodypart of snake) {
		//console.log(bodypart.origin);
		ellipse(bodypart.origin.x, bodypart.origin.y, bodypart.skinDistance);
	}
}

function setup() {
	const lizard = [
		new RadiusDiscriptor(undefined, 52),
		new RadiusDiscriptor(26, 58),
		new RadiusDiscriptor(29, 40),
		new RadiusDiscriptor(22, 60),
		new RadiusDiscriptor(33, 68),
		new RadiusDiscriptor(27, 71),
		new RadiusDiscriptor(32, 64),
		new RadiusDiscriptor(25, 50),
		new RadiusDiscriptor(30, 28),
		new RadiusDiscriptor(25, 15),
		new RadiusDiscriptor(25, 11),
		new RadiusDiscriptor(25, 9),
		new RadiusDiscriptor(25, 7),
		new RadiusDiscriptor(25, 7),
	];
	const snake = [
		new RadiusDiscriptor(undefined, 52),
		new RadiusDiscriptor(26, 58),
		new RadiusDiscriptor(29, 44),
		new RadiusDiscriptor(22, 43),
		new RadiusDiscriptor(22, 43),
		new RadiusDiscriptor(22, 42),
		new RadiusDiscriptor(22, 42),
		new RadiusDiscriptor(22, 41),
		new RadiusDiscriptor(22, 41),
		new RadiusDiscriptor(22, 39),
		new RadiusDiscriptor(22, 39),
		new RadiusDiscriptor(22, 38),
		new RadiusDiscriptor(22, 38),
		new RadiusDiscriptor(22, 37),
		new RadiusDiscriptor(22, 37),
		new RadiusDiscriptor(22, 36),
		new RadiusDiscriptor(22, 36),
		new RadiusDiscriptor(22, 35),
		new RadiusDiscriptor(22, 35),
		new RadiusDiscriptor(22, 34),
		new RadiusDiscriptor(22, 34),
		new RadiusDiscriptor(22, 33),
		new RadiusDiscriptor(22, 33),
		new RadiusDiscriptor(22, 32),
		new RadiusDiscriptor(22, 32),
		new RadiusDiscriptor(22, 31),
		new RadiusDiscriptor(22, 31),
		new RadiusDiscriptor(22, 30),
		new RadiusDiscriptor(22, 30),
		new RadiusDiscriptor(22, 29),
		new RadiusDiscriptor(22, 29),
		new RadiusDiscriptor(22, 28),
		new RadiusDiscriptor(22, 28),
		new RadiusDiscriptor(22, 27),
		new RadiusDiscriptor(22, 27),
		new RadiusDiscriptor(22, 26),
		new RadiusDiscriptor(22, 26),
		new RadiusDiscriptor(22, 25),
		new RadiusDiscriptor(22, 25),
		new RadiusDiscriptor(22, 24),
		new RadiusDiscriptor(22, 24),
		new RadiusDiscriptor(22, 23),
		new RadiusDiscriptor(22, 23),
		new RadiusDiscriptor(22, 22),
		new RadiusDiscriptor(22, 22),
		new RadiusDiscriptor(22, 21),
		new RadiusDiscriptor(22, 21),
		new RadiusDiscriptor(22, 20),
		new RadiusDiscriptor(22, 20),
		new RadiusDiscriptor(22, 19),
		new RadiusDiscriptor(22, 18),
		new RadiusDiscriptor(22, 17),
		new RadiusDiscriptor(22, 16),
		new RadiusDiscriptor(22, 15),
		new RadiusDiscriptor(22, 14),
		new RadiusDiscriptor(22, 13),
		new RadiusDiscriptor(22, 12),
		new RadiusDiscriptor(22, 11),
		new RadiusDiscriptor(22, 10),
		new RadiusDiscriptor(22, 7),
	];
	const test = [
		new RadiusDiscriptor(undefined, 52),
		new RadiusDiscriptor(26, 58)
	];

	const FPS = 60;
	const speedInPixels = 10;

	const animal = setupAnimal(new Point(1200, 300), snake);

	createCanvas(1400, 700);

	drawAnimal(animal);
	setInterval(() => { animal.step(speedInPixels); drawAnimal(animal); }, Math.floor(1000 / FPS));
}