import Point from "./Point";

/**
 * Draws a Bézier curve across the given points.
 * @param {Point[]} points The points to go across.
 */
export function drawLine(points) {
	beginShape();

	curveVertex(points[0].x, points[0].y);
	for (const point of points)
		curveVertex(point.x, point.y);
	curveVertex(points[points.length - 1].x, points[points.length - 1].y);

	endShape();
}

/**
 * Draws a Bézier curve across the given points and loops it back to the first point.
 * @param {Point[]} points The points to go across.
 */
export function drawLoop(points) {
	beginShape();

	curveVertex(points[0].x, points[0].y);
	for (const point of points)
		curveVertex(point.x, point.y);
	curveVertex(points[0].x, points[0].y);
	curveVertex(points[0].x, points[0].y);

	endShape();
}