import * as bezierLine from './bezierLine.js';
import Point from './Point.js';
import Color from './Color.js';
import Segment from './Segment.js';
import { Bodypart, Eye, BackFin, SideFin } from './Bodypart.js';

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

function setupAnimal(startingPoint, discriptors) {
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
	fill(animal.bodyColor.r, animal.bodyColor.g, animal.bodyColor.b, animal.bodyColor.a);

	bezierLine.drawLoop(getPointsOfAnimal(animal.headSegment));
}

function animationLoop(animal, speedInPixels) {
	background(20, 80, 20);

	animal.step(speedInPixels);

	for (const segment of animal.headSegment) {
		if (segment.bodypart instanceof Bodypart && !segment.bodypart.render)
			segment.bodypart.draw();
	}

	drawAnimalByPoints(animal);
	//drawAnimalByCircles(animal.headSegment);

	for (const segment of animal.headSegment) {
		if (segment.bodypart instanceof Bodypart && segment.bodypart.render)
			segment.bodypart.draw();
	}
}

window.setup = () => {
	strokeCap(ROUND);
	strokeJoin(ROUND);
	stroke(0);
	createCanvas(1600, 800);

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
	const fish = [
		new SegmentDiscriptor(18, 18, new Eye(100, 16, 20, new Color(0, 0, 100))),
		new SegmentDiscriptor(22, 30, new SideFin(40, 20, 20, new Color(0, 0, 190))),
		new SegmentDiscriptor(33, 34, new BackFin(2, new Color(0, 0, 190))),
		new SegmentDiscriptor(27, 36),
		new SegmentDiscriptor(32, 32),
		new SegmentDiscriptor(25, 25),
		new SegmentDiscriptor(30, 14),
		new SegmentDiscriptor(25, 8),
		new SegmentDiscriptor(25, 6),
	];

	const FPS = 60;
	const speedInPixels = 10;
	const animal = new Animal(new Point(width / 2, height / 2), fish, new Color(20, 130, 255));

	setInterval(() => { animationLoop(animal, speedInPixels); }, Math.floor(1000 / FPS));
}