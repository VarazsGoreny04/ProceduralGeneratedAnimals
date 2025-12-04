import * as bezierLine from './bezierLine.js';
import Point from './Point.js';
import Segment from './Segment.js';
import { Bodypart } from './Bodypart.js';

export default class Animal {
	constructor(headPosition, radiusDiscriptors, bodyColor) {
		this.headSegment = Animal.create(headPosition, radiusDiscriptors);
		this.bodyColor = bodyColor;
	}

	static create(startingPoint, discriptors) {
		const result = new Segment(
			startingPoint,
			discriptors[0].nextSegmentDistance,
			discriptors[0].skinRadius,
			discriptors[0].bodypart
		);
		if (result.bodypart instanceof Bodypart)
			result.bodypart.segment = result;

		let current = result;
		let next;

		for (let index = 1; index < discriptors.length; ++index) {
			next = new Segment(
				new Point(current.origin.x - discriptors[index].nextSegmentDistance, current.origin.y),
				discriptors[index].nextSegmentDistance,
				discriptors[index].skinRadius,
				discriptors[index].bodypart
			);
			if (next.bodypart instanceof Bodypart)
				next.bodypart.segment = next;

			current.nextSegment = next;
			next.prevSegment = current;
			current = next;
		}

		return result
	}

	static getPoints(headSegment) {
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

	static drawByCircles(animal) {
		for (const segment of animal.headSegment) {
			if (segment.bodypart instanceof Bodypart && !segment.bodypart.render)
				segment.bodypart.draw();
		}

		for (const segment of animal.headSegment)
			ellipse(segment.origin.x, segment.origin.y, segment.skinRadius * 2);

		for (const segment of animal.headSegment) {
			if (segment.bodypart instanceof Bodypart && segment.bodypart.render)
				segment.bodypart.draw();
		}
	}

	static drawByPoints(animal) {
		for (const segment of animal.headSegment) {
			if (segment.bodypart instanceof Bodypart && !segment.bodypart.render)
				segment.bodypart.draw();
		}

		fill(animal.bodyColor.r, animal.bodyColor.g, animal.bodyColor.b, animal.bodyColor.a);
		bezierLine.drawLoop(Animal.getPoints(animal.headSegment));

		for (const segment of animal.headSegment) {
			if (segment.bodypart instanceof Bodypart && segment.bodypart.render)
				segment.bodypart.draw();
		}
	}

	step(speedInPixels) {
		Segment.step(this.headSegment, speedInPixels);
	}
}