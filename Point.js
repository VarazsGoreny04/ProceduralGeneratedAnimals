/** Describes a point in the 2D space. */
export default class Point {
	/**
	 * Creates a Point object.
	 * @param {number} x The X value.
	 * @param {number} y The Y value.
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Adds two points.
	 * @param {Point} a The first point.
	 * @param {Point} b The second point.
	 * @returns The result of the calculation.
	 */
	static add(a, b) {
		return new Point(a.x + b.x, a.y + b.y);
	}

	/**
	 * Subtracts two points.
	 * @param {Point} a The first point.
	 * @param {Point} b The second point.
	 * @returns The result of the calculation.
	 */
	static subtract(a, b) {
		return new Point(a.x - b.x, a.y - b.y);
	}

	/**
	 * Scales a vector by a number.
	 * @param {Point} v The vector.
	 * @param {number} s The number.
	 * @returns The result of the calculation.
	 */
	static multiply(v, s) {
		return new Point(v.x * s, v.y * s);
	}

	/**
	 * Divides a vector by a number.
	 * @param {Point} v The vector.
	 * @param {number} s The number.
	 * @returns The result of the calculation.
	 */
	static divide(v, s) {
		return new Point(v.x / s, v.y / s);
	}

	/**
	 * Gets the magnitude of the given vector.
	 * @param {Point} v The vector.
	 * @returns The result of the calculation.
	 */
	static magnitude(v) {
		return Math.sqrt(v.x ** 2 + v.y ** 2);
	}

	/**
	 * Gets the distance of the two points.
	 * @param {Point} a The first point.
	 * @param {Point} b The second point.
	 * @returns The result of the calculation.
	 */
	static distance(a, b) {
		return Point.magnitude(Point.subtract(a, b));
	}

	/**
	 * Normalizes the given vector.
	 * @param {Point} v The vector.
	 * @returns The result of the calculation.
	 */
	static normalize(v) {
		return Point.divide(v, Point.magnitude(v));
	}

	/**
	 * Scales a vector to a length.
	 * @param {Point} v The vector.
	 * @param {number} s The length.
	 * @returns The result of the calculation.
	 */
	static scale(v, s) {
		return Point.multiply(Point.normalize(v), s);
	}

	/**
	 * Gets the left normalvector of the given vector.
	 * @param {Point} v The vector.
	 * @returns The result of the calculation.
	 */
	static normalLeft(v) {
		return new Point(-v.y, v.x);
	}

	/**
	 * Gets the right normalvector of the given vector.
	 * @param {Point} v The vector.
	 * @returns The result of the calculation.
	 */
	static normalRight(v) {
		return new Point(v.y, -v.x);
	}

	/**
	 * Reverses the given vector.
	 * @param {Point} v The vector.
	 * @returns The result of the calculation.
	 */
	static reverse(v) {
		return new Point(-v.x, -v.y);
	}

	/**
	 * Rotates the given vector by a radian value.
	 * @param {Point} v The vector.
	 * @param {number} radian The radian value.
	 * @returns The result of the calculation.
	 */
	static rotateRadian(v, radian) {
		const sinR = sin(radian);
		const cosR = cos(radian);

		return new Point(cosR * v.x - sinR * v.y, sinR * v.x + cosR * v.y);
	}

	/**
	 * Rotates the given vector by a degree value.
	 * @param {Point} v The vector.
	 * @param {number} degree The degree value.
	 * @returns The result of the calculation.
	 */
	static rotateDegree(v, degree) {
		return Point.rotateRadian(v, radians(degree));
	}

	/**
	 * Gets the position of the mouse.
	 * @returns The coordinates of the mouse.
	 */
	static mouse() {
		return new Point(mouseX, mouseY);
	}

	/**
	 * Gets the dot product of the given vectors.
	 * @param {Point} v1 The first vector.
	 * @param {Point} v2 The second vector.
	 * @returns The result of the calculation.
	 */
	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}

	/**
	 * Projects a vector to another.
	 * @param {Point} v1 The vector to project.
	 * @param {Point} v2 The line of the projection.
	 * @returns The result of the calculation.
	 */
	static project(v1, v2) {
		return Point.multiply(v2, Point.dot(v1, v2) / Point.dot(v1, v2));
	}

	/**
	 * Gets the cosine of two vectors.
	 * @param {Point} v1 The first vector.
	 * @param {Point} v2 The second vector.
	 * @returns The result of the calculation.
	 */
	static cosOfVectors(v1, v2) {
		return Point.dot(v1, v2) / (Point.magnitude(v1) * Point.magnitude(v2));
	}

	/**
	 * Gets the sine of two vectors.
	 * @param {Point} v1 The first vector.
	 * @param {Point} v2 The second vector.
	 * @returns The result of the calculation.
	 */
	static sinOfVectors(v1, v2) {
		v1 = Point.normalLeft(v1);
		return Point.cosOfVectors(v1, v2);
	}

	/**
	 * Gets the cosine of three points.
	 * @param {Point} a The first point.
	 * @param {Point} b The middle point.
	 * @param {Point} c The last point.
	 * @returns The result of the calculation.
	 */
	static cosOfPoints(a, b, c) {
		const v1 = Point.subtract(a, b);
		const v2 = Point.subtract(c, b);

		return Point.cosOfVectors(v1, v2);
	}

	/**
	 * Gets the sine of three points.
	 * @param {Point} a The first point.
	 * @param {Point} b The middle point.
	 * @param {Point} c The last point.
	 * @returns The result of the calculation.
	 */
	static sinOfPoints(a, b, c) {
		const v1 = Point.subtract(a, b);
		const v2 = Point.subtract(c, b);

		return Point.sinOfVectors(v1, v2);
	}

	/**
	 * Gets the angle of a vector to the X base line.
	 * @param {Point} v The vector.
	 * @returns The angle in degrees.
	 */
	static angleOfVector(v) {
		return degrees(atan2(v.y, v.x));
	}

	/**
	 * Gets the angle of two vectors.
	 * @param {Point} v1 The first vector.
	 * @param {Point} v2 The second vector.
	 * @returns The angle in degrees.
	 */
	static angleOfVectors(v1, v2) {
		const angle = degrees(atan2(v2.y, v2.x) - atan2(v1.y, v1.x));

		return angle > 180 ? angle - 360 : (angle < -180 ? angle + 360 : angle);
	}

	/**
	 * Gets the angle of three points.
	 * @param {Point} a The first point.
	 * @param {Point} b The middle point.
	 * @param {Point} c The last point.
	 * @returns The angle in degrees.
	 */
	static angleOfPoints(a, b, c) {
		const v1 = Point.subtract(a, b);
		const v2 = Point.subtract(c, b);

		return Point.angleOfVectors(v1, v2);
	}

	/**
	 * Restricts the angle a given vector.
	 * @param {Point} baseVector The base vector.
	 * @param {Point} directionVector The vector to restrict.
	 * @param {number} maxAngle The maximum angle in degrees.
	 * @param {number} minAngle The minimum angle in degrees.
	 * @returns The restricted vector.
	 */
	static restrictAngleOfRotation(baseVector, directionVector, maxAngle, minAngle) {
		const angleBetween = Point.angleOfVectors(baseVector, directionVector);

		if (minAngle < angleBetween && angleBetween < maxAngle)
			return directionVector;

		const toRotate = (minAngle < angleBetween ? maxAngle : minAngle) - angleBetween;

		return Point.rotateDegree(directionVector, toRotate);
	}
}