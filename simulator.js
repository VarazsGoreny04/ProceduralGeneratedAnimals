import Point from './Point.js';
import Color from './Color.js';
import Animal from './Animal.js';
import { SegmentDiscriptor, EyeDiscriptor, SideFinDiscriptor, BackFinDiscriptor, TailFinDiscriptor } from './Discriptor.js';

function animationLoop(animal, speedInPixels) {
	const currentMousePosition = Point.mouse();

	if (Point.magnitude(Point.subtract(currentMousePosition, animal.headSegment.origin)) < speedInPixels)
		return;

	background(20, 80, 20);

	animal.step(currentMousePosition, speedInPixels);

	Animal.drawByPoints(animal);
}

window.setup = () => {
	strokeCap(ROUND);
	strokeJoin(ROUND);
	stroke(0);
	createCanvas(1600, 800);

	const snake = [
		new SegmentDiscriptor(0, 26, new EyeDiscriptor(115, 22, 10, new Color(0, 0, 0))),
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
		new SegmentDiscriptor(0, 26, new EyeDiscriptor(115, 22, 10, new Color(0, 0, 0))),
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
		new SegmentDiscriptor(0, 18, new EyeDiscriptor(100, 16, 20, new Color(0, 0, 100))),
		new SegmentDiscriptor(22, 30, new SideFinDiscriptor(40, 12, 20, new Color(0, 0, 140))),
		new SegmentDiscriptor(33, 34, new BackFinDiscriptor(2, new Color(0, 0, 140))),
		new SegmentDiscriptor(27, 36),
		new SegmentDiscriptor(32, 32),
		new SegmentDiscriptor(25, 25, new SideFinDiscriptor(20, 7, 5, new Color(0, 0, 140))),
		new SegmentDiscriptor(30, 14),
		new SegmentDiscriptor(20, 8),
		new SegmentDiscriptor(15, 5),
		new SegmentDiscriptor(10, 2,
			new TailFinDiscriptor(
				[20, 15, 10],
				new Color(0, 0, 140)
			)
		),
	];

	const FPS = 60;
	const speedInPixels = 10;
	const animal = new Animal(new Point(width / 2, height / 2), fish, new Color(20, 130, 255));

	setInterval(() => { animationLoop(animal, Math.floor((60 / FPS) * speedInPixels)); }, Math.floor(1000 / FPS));
}