export default class Point {
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

	static reverse(v) {
		return new Point(-v.x, -v.y);
	}

	static rotateRadian(v, radian) {
		if (Math.abs(radian) < 1e-6)
			return v;

		const sinR = sin(radian);
		const cosR = cos(radian);

		return new Point(cosR * v.x - sinR * v.y, sinR * v.x + cosR * v.y);
	}

	static rotateDegree(v, degree) {
		degree %= 360;
		return Point.rotateRadian(v, radians(degree));
	}

	static mouse() {
		return new Point(mouseX, mouseY);
	}

	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}

	static project(v1, v2) {
		return Point.multiply(v2, Point.dot(v1, v2) / Point.dot(v1, v2));
	}

	static cosOfVectors(v1, v2) {
		return Point.dot(v1, v2) / (Point.magnitude(v1) * Point.magnitude(v2));
	}

	static sinOfVectors(v1, v2) {
		v1 = Point.normalLeft(v1);
		return Point.cosOfVectors(v1, v2);
	}

	static cosOfPoints(a, b, c) {
		const v1 = Point.subtract(a, b);
		const v2 = Point.subtract(c, b);

		return Point.cosOfVectors(v1, v2);
	}

	static sinOfPoints(a, b, c) {
		const v1 = Point.subtract(a, b);
		const v2 = Point.subtract(c, b);

		return Point.sinOfVectors(v1, v2);
	}

	static angleOfVectors(v1, v2) {
		const cosAngle = Point.cosOfVectors(v1, v2);
		let angle = degrees(asin(Point.sinOfVectors(v1, v2)));

		return cosAngle > 0 ? angle : (angle > 0 ? 180 - angle : -180 - angle);
	}

	static angleOfPoints(a, b, c) {
		const v1 = Point.subtract(a, b);
		const v2 = Point.subtract(c, b);

		return Point.angleOfVectors(v1, v2);
	}

	static restrictAngleOfRotation(baseVector, directionVector, maxAngle, minAngle) {
		const angle = Point.angleOfVectors(baseVector, directionVector);

		if (minAngle < angle && angle < maxAngle)
			return directionVector;

		const toRotate = (minAngle < angle ? maxAngle : minAngle) - angle;

		return Point.rotateDegree(directionVector, toRotate);
	}
}