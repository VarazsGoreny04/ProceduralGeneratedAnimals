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

class Circle {
	constructor(origin, distance) {
		this.origin = origin;
		this.distance = distance;
	}

	static points() { }
}

class Bodypart {
	constructor(origin, distance, nextSegment) {
		this.origin = origin;
		this.distance = distance;
		this.nextSegment = nextSegment;
	}

	*[Symbol.iterator]() {
		let current = this;
		while (current) {
			yield current;
			current = current.nextSegment;
		}
	}

	step() {
		let mouse = new Point(mouseX, mouseY);
		let vectorToMouse = Point.subtract(this.origin, mouse)
		let direction = Point.multiply(Point.normalize(vectorToMouse), 1);

		this.origin = Point.add(this.origin, direction);
		Bodypart.pullNext(this);
	}

	static pullNext(bodypart) {
		if (bodypart.nextSegment instanceof Bodypart) {
			let vector = Point.subtract(bodypart.origin, bodypart.nextSegment.origin);

			bodypart.nextSegment.origin = Point.add(bodypart.origin, Point.multiply(Point.normalize(vector), bodypart.distance));

			Bodypart.pullNext(bodypart.nextSegment);
		}
	}
}

function setupSnake() {
	return new Bodypart(
		new Point(700, 300),
		10,
		new Bodypart(
			new Point(690, 300),
			10,
			new Bodypart(
				new Point(680, 300),
				10,
				new Bodypart(
					new Point(670, 300),
					10,
					new Bodypart(
						new Point(660, 300),
						10,
						new Bodypart(
							new Point(650, 300),
							10,
							new Bodypart(
								new Point(640, 300),
								10,
								new Bodypart(
									new Point(630, 300),
									10,
									new Bodypart(
										new Point(620, 300),
										10,
										new Bodypart(
											new Point(610, 300),
											10,
											undefined
										)
									)
								)
							)
						)
					)
				)
			)
		)
	)
}

function drawSnake(snake) {
	background(100, 100, 100);
	stroke(255);
	fill(255, 0, 0);

	console.log("Head");
	for (const bodypart of snake) {
		console.log(bodypart.origin);
		ellipse(bodypart.origin.x, bodypart.origin.y, bodypart.distance);
	}
}

function setup() {
	let snake = setupSnake();

	createCanvas(1400, 700);

	drawSnake(snake);
	setInterval(function () { snake.step(); drawSnake(snake); }, 1);
}