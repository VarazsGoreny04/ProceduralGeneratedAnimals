import Point from './Point.js';
import Color from './Color.js';
import Animal from './Animal.js';
import { Bodypart } from './Bodypart.js';
import { AnimalDescriptor, SegmentDescriptor, EyeDescriptor, SideFinDescriptor, BackFinDescriptor, TailFinDescriptor, AntennaDescriptor } from './Descriptor.js';

function animationLoop(animal, speedInPixels) {
	const currentMousePosition = Point.mouse();

	if (Point.magnitude(Point.subtract(currentMousePosition, animal.headSegment.origin)) < speedInPixels)
		return;

	background(20, 80, 20);

	animal.step(currentMousePosition, speedInPixels);
	animal.draw();
}

window.setup = () => {
	strokeCap(ROUND);
	strokeJoin(ROUND);
	stroke(0);
	createCanvas(1600, 800);

	const snake = new AnimalDescriptor(
		new Point(width / 2, height / 2),
		[
			new SegmentDescriptor(0, 26, new EyeDescriptor(115, 22, 10, new Color(0, 0, 0))),
			new SegmentDescriptor(26, 29),
			new SegmentDescriptor(29, 23),
			new SegmentDescriptor(22, 22),
			new SegmentDescriptor(22, 22),
			new SegmentDescriptor(22, 22),
			new SegmentDescriptor(22, 22),
			new SegmentDescriptor(22, 21),
			new SegmentDescriptor(22, 21),
			new SegmentDescriptor(22, 21),
			new SegmentDescriptor(22, 21),
			new SegmentDescriptor(22, 20),
			new SegmentDescriptor(22, 20),
			new SegmentDescriptor(22, 20),
			new SegmentDescriptor(22, 20),
			new SegmentDescriptor(22, 19),
			new SegmentDescriptor(22, 19),
			new SegmentDescriptor(22, 19),
			new SegmentDescriptor(22, 19),
			new SegmentDescriptor(22, 18),
			new SegmentDescriptor(22, 18),
			new SegmentDescriptor(22, 18),
			new SegmentDescriptor(22, 18),
			new SegmentDescriptor(22, 17),
			new SegmentDescriptor(22, 17),
			new SegmentDescriptor(22, 17),
			new SegmentDescriptor(22, 17),
			new SegmentDescriptor(22, 16),
			new SegmentDescriptor(22, 16),
			new SegmentDescriptor(22, 16),
			new SegmentDescriptor(22, 16),
			new SegmentDescriptor(22, 15),
			new SegmentDescriptor(22, 15),
			new SegmentDescriptor(22, 15),
			new SegmentDescriptor(22, 15),
			new SegmentDescriptor(22, 14),
			new SegmentDescriptor(22, 14),
			new SegmentDescriptor(22, 14),
			new SegmentDescriptor(22, 13),
			new SegmentDescriptor(22, 13),
			new SegmentDescriptor(22, 13),
			new SegmentDescriptor(22, 12),
			new SegmentDescriptor(22, 12),
			new SegmentDescriptor(22, 12),
			new SegmentDescriptor(22, 11),
			new SegmentDescriptor(22, 11),
			new SegmentDescriptor(22, 11),
			new SegmentDescriptor(22, 10),
			new SegmentDescriptor(22, 10),
			new SegmentDescriptor(22, 10),
			new SegmentDescriptor(22, 9),
			new SegmentDescriptor(22, 9),
			new SegmentDescriptor(22, 9),
			new SegmentDescriptor(22, 8),
			new SegmentDescriptor(22, 8),
			new SegmentDescriptor(22, 7),
			new SegmentDescriptor(22, 7),
			new SegmentDescriptor(22, 6),
			new SegmentDescriptor(22, 5),
			new SegmentDescriptor(22, 4)
		],
		new Color(190, 0, 0)
	);
	const lizard = new AnimalDescriptor(
		new Point(width / 2, height / 2),
		[
			new SegmentDescriptor(0, 26, new EyeDescriptor(115, 22, 10, new Color(0, 0, 0))),
			new SegmentDescriptor(26, 29),
			new SegmentDescriptor(29, 20),
			new SegmentDescriptor(22, 30, new AntennaDescriptor([new SegmentDescriptor(25, 10), new SegmentDescriptor(20, 10)], 80, new Color(0, 255, 0))),
			new SegmentDescriptor(33, 34),
			new SegmentDescriptor(27, 36),
			new SegmentDescriptor(32, 32),
			new SegmentDescriptor(25, 25, new AntennaDescriptor([new SegmentDescriptor(25, 10), new SegmentDescriptor(20, 10)], 80, new Color(0, 255, 0))),
			new SegmentDescriptor(30, 14),
			new SegmentDescriptor(25, 8),
			new SegmentDescriptor(25, 6),
			new SegmentDescriptor(25, 5),
			new SegmentDescriptor(25, 4),
			new SegmentDescriptor(25, 3),
			new SegmentDescriptor(6, 2)
		],
		new Color(0, 190, 0)
	);
	const fish = new AnimalDescriptor(
		new Point(width / 2, height / 2),
		[
			new SegmentDescriptor(0, 18, new EyeDescriptor(100, 16, 20, new Color(0, 0, 100), Bodypart.BOTTOM)),
			new SegmentDescriptor(22, 30, new SideFinDescriptor(40, 12, 20, new Color(0, 0, 140))),
			new SegmentDescriptor(33, 34, new BackFinDescriptor(2, new Color(0, 0, 140))),
			new SegmentDescriptor(27, 36),
			new SegmentDescriptor(32, 32),
			new SegmentDescriptor(25, 25, new SideFinDescriptor(20, 7, 5, new Color(0, 0, 140))),
			new SegmentDescriptor(30, 14),
			new SegmentDescriptor(20, 8),
			new SegmentDescriptor(15, 5),
			new SegmentDescriptor(10, 2, new TailFinDescriptor([20, 15, 10], new Color(0, 0, 140)))
		],
		new Color(20, 130, 255)
	);

	const FPS = 60;
	const speedInPixels = 10;
	const animal = snake.create();

	setInterval(() => { animationLoop(animal, Math.floor((60 / FPS) * speedInPixels)); }, Math.floor(1000 / FPS));
}