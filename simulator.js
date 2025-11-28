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
	constructor(origin, segmentDistance, skinRadius, plusPoints, prevSegment, nextSegment) {
		this.origin = origin;
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;
		this.plusPoints = plusPoints;
		this.prevSegment = prevSegment;
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
		const vectorToMouse = Point.subtract(Point.mouse(), this.origin);

		if (Point.magnitude(vectorToMouse) < speedInPixels)
			return;

		const direction = Point.multiply(Point.normalize(vectorToMouse), speedInPixels);

		this.origin = Point.add(this.origin, direction);
		Bodypart.pullNext(this);
	}

	static pullNext(bodypart) {
		if (bodypart.nextSegment instanceof Bodypart) {
			const vector = Point.subtract(bodypart.nextSegment.origin, bodypart.origin);

			bodypart.nextSegment.origin = Point.add(bodypart.origin, Point.multiply(Point.normalize(vector), bodypart.nextSegment.segmentDistance));

			Bodypart.pullNext(bodypart.nextSegment);
		}
	}

	static getFrontVector(bodypart) {
		let prev = bodypart.prevSegment;
		let next = bodypart.nextSegment;

		if (!(prev instanceof Bodypart || next instanceof Bodypart))
			throw "Not enough bodyparts!";

		if (!(prev instanceof Bodypart))
			prev = bodypart;
		if (!(next instanceof Bodypart))
			next = bodypart;

		const vector = Point.subtract(prev.origin, next.origin);

		return Point.multiply(Point.normalize(vector), bodypart.skinRadius);
	}
}

class RadiusDiscriptor {
	constructor(segmentDistance, skinRadius, plusPoints) {
		this.segmentDistance = segmentDistance;
		this.skinRadius = skinRadius;
		this.plusPoints = plusPoints;
	}
}

function setupAnimal(startingPoint, radiusDiscriptorArray) {
	const result = new Bodypart(
		startingPoint,
		radiusDiscriptorArray[0].segmentDistance,
		radiusDiscriptorArray[0].skinRadius,
		radiusDiscriptorArray[0].plusPoints,
		undefined,
		undefined
	);
	let current = result;
	let next;

	for (let index = 1; index < radiusDiscriptorArray.length; ++index) {
		next = new Bodypart(
			new Point(current.origin.x - radiusDiscriptorArray[index].segmentDistance, current.origin.y),
			radiusDiscriptorArray[index].segmentDistance,
			radiusDiscriptorArray[index].skinRadius,
			radiusDiscriptorArray[index].plusPoints,
			current,
			undefined
		);

		current.nextSegment = next;
		current = next;
	}

	return result
}

function drawAnimal(animal) {
	//console.log("Head");
	for (const bodypart of animal) {
		//console.log(bodypart.origin);
		ellipse(bodypart.origin.x, bodypart.origin.y, bodypart.skinRadius * 2);
	}
}

function getPointsOfAnimal(animal) {
	const left = [];
	const right = [];
	let end;

	for (const bodypart of animal) {
		let front = Bodypart.getFrontVector(bodypart);

		if (bodypart.plusPoints instanceof Array) {
			for (const angle of bodypart.plusPoints) {
				if (Math.abs(angle) < 90) {
					const angleInRadian = radians(angle);

					left.push(Point.add(bodypart.origin, Point.rotateRadian(front, angleInRadian)));
					right.push(Point.add(bodypart.origin, Point.rotateRadian(front, -angleInRadian)));
				}
			}
		}

		left.push(Point.add(bodypart.origin, Point.normalLeft(front)));
		right.push(Point.add(bodypart.origin, Point.normalRight(front)));

		if (bodypart.plusPoints instanceof Array) {
			for (const angle of bodypart.plusPoints) {
				if (Math.abs(angle) > 90) {
					const angleInRadian = radians(angle);

					left.push(Point.add(bodypart.origin, Point.rotateRadian(front, angleInRadian)));
					right.push(Point.add(bodypart.origin, Point.rotateRadian(front, -angleInRadian)));
				}
			}
		}

		end = bodypart;
	}

	const frontPoint = Point.add(animal.origin, Bodypart.getFrontVector(animal));
	const backPoint = Point.subtract(end.origin, Bodypart.getFrontVector(end));
	return [backPoint].concat(right.reverse()).concat([frontPoint]).concat(left);
}

function drawLoop(points) {
	if (points.length < 1)
		return;

	beginShape();
	curveVertex(points[0].x, points[0].y);
	for (const point of points)
		curveVertex(point.x, point.y);
	curveVertex(points[0].x, points[0].y);
	curveVertex(points[0].x, points[0].y);
	endShape();
}

function animationLoop(animal, speedInPixels) {
	background(100, 100, 100);

	stroke(255);
	fill(255, 0, 0, 255);

	animal.step(speedInPixels);

	const points = getPointsOfAnimal(animal);
	drawLoop(points);

	//drawAnimal(animal);
}

function setup() {
	const lizard = [
		new RadiusDiscriptor(undefined, 26, [45]),
		new RadiusDiscriptor(26, 29),
		new RadiusDiscriptor(29, 20),
		new RadiusDiscriptor(22, 30),
		new RadiusDiscriptor(33, 34),
		new RadiusDiscriptor(27, 36),
		new RadiusDiscriptor(32, 32),
		new RadiusDiscriptor(25, 25),
		new RadiusDiscriptor(30, 14),
		new RadiusDiscriptor(25, 8),
		new RadiusDiscriptor(25, 6),
		new RadiusDiscriptor(25, 5),
		new RadiusDiscriptor(25, 4),
		new RadiusDiscriptor(25, 4),
	];
	const snake = [
		new RadiusDiscriptor(undefined, 26, [45]),
		new RadiusDiscriptor(26, 29),
		new RadiusDiscriptor(29, 23),
		new RadiusDiscriptor(22, 22),
		new RadiusDiscriptor(22, 22),
		new RadiusDiscriptor(22, 22),
		new RadiusDiscriptor(22, 22),
		new RadiusDiscriptor(22, 21),
		new RadiusDiscriptor(22, 21),
		new RadiusDiscriptor(22, 21),
		new RadiusDiscriptor(22, 21),
		new RadiusDiscriptor(22, 20),
		new RadiusDiscriptor(22, 20),
		new RadiusDiscriptor(22, 20),
		new RadiusDiscriptor(22, 20),
		new RadiusDiscriptor(22, 19),
		new RadiusDiscriptor(22, 19),
		new RadiusDiscriptor(22, 19),
		new RadiusDiscriptor(22, 19),
		new RadiusDiscriptor(22, 18),
		new RadiusDiscriptor(22, 18),
		new RadiusDiscriptor(22, 18),
		new RadiusDiscriptor(22, 18),
		new RadiusDiscriptor(22, 17),
		new RadiusDiscriptor(22, 17),
		new RadiusDiscriptor(22, 17),
		new RadiusDiscriptor(22, 17),
		new RadiusDiscriptor(22, 16),
		new RadiusDiscriptor(22, 16),
		new RadiusDiscriptor(22, 16),
		new RadiusDiscriptor(22, 16),
		new RadiusDiscriptor(22, 15),
		new RadiusDiscriptor(22, 15),
		new RadiusDiscriptor(22, 15),
		new RadiusDiscriptor(22, 15),
		new RadiusDiscriptor(22, 14),
		new RadiusDiscriptor(22, 14),
		new RadiusDiscriptor(22, 14),
		new RadiusDiscriptor(22, 13),
		new RadiusDiscriptor(22, 13),
		new RadiusDiscriptor(22, 13),
		new RadiusDiscriptor(22, 12),
		new RadiusDiscriptor(22, 12),
		new RadiusDiscriptor(22, 12),
		new RadiusDiscriptor(22, 11),
		new RadiusDiscriptor(22, 11),
		new RadiusDiscriptor(22, 11),
		new RadiusDiscriptor(22, 10),
		new RadiusDiscriptor(22, 10),
		new RadiusDiscriptor(22, 10),
		new RadiusDiscriptor(22, 9),
		new RadiusDiscriptor(22, 9),
		new RadiusDiscriptor(22, 9),
		new RadiusDiscriptor(22, 8),
		new RadiusDiscriptor(22, 8),
		new RadiusDiscriptor(22, 7),
		new RadiusDiscriptor(22, 7),
		new RadiusDiscriptor(22, 6),
		new RadiusDiscriptor(22, 5),
		new RadiusDiscriptor(22, 4),
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
	setInterval(() => { animationLoop(animal, speedInPixels); }, Math.floor(1000 / FPS));
}