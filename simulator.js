import Point from './Point.js';
import Color from './Color.js';
import { Bodypart } from './Bodypart.js';
import {
	AnimalDescriptor,
	SegmentDescriptor,
	EyeDescriptor,
	SideFinDescriptor,
	BackFinDescriptor,
	TailFinDescriptor,
	AntennaDescriptor,
	AntennaSegmentDescriptor,
	LegDescriptor,
	LegSegmentDescriptor
} from './Descriptor.js';

function animationLoop(animal, speedInPixels) {
	const currentMousePosition = Point.mouse();

	if (Point.magnitude(Point.subtract(currentMousePosition, animal.headSegment.origin)) < speedInPixels)
		return;

	background(20, 80, 20);

	animal.step(currentMousePosition, speedInPixels);
	animal.draw();
}

window.setup = () => {
	/* const middle = new Point(width / 2, height / 2);
	const vector = new Point(1, 1);

	fill(255, 255, 255);
	ellipse(middle.x, middle.y, 10, 10);

	setInterval(() => {
		const mouse = Point.subtract(Point.mouse(), middle);
		console.log(Point.angleOfVectors(vector, mouse));
	});
}

function test() { */
	strokeCap(ROUND);
	strokeJoin(ROUND);
	stroke(0);
	createCanvas(1600, 800);

	const snake = new AnimalDescriptor(
		new Point(width / 2, height / 2),
		[
			new SegmentDescriptor(0, 26, [new EyeDescriptor(115, 22, 10, new Color(0, 0, 0))]),
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
			new SegmentDescriptor(0, 26, [new EyeDescriptor(115, 22, 10, new Color(0, 0, 0))]),
			new SegmentDescriptor(26, 29),
			new SegmentDescriptor(29, 20),
			new SegmentDescriptor(22, 30,
				[new AntennaDescriptor(
					[
						new AntennaSegmentDescriptor(25, 10, 0),
						new AntennaSegmentDescriptor(15, 8, 0),
						new AntennaSegmentDescriptor(12, 6, -10)
					],
					90,
					new Color(0, 190, 0)
				)]
			),
			new SegmentDescriptor(33, 34),
			new SegmentDescriptor(27, 36),
			new SegmentDescriptor(32, 32),
			new SegmentDescriptor(25, 25,
				[new AntennaDescriptor(
					[
						new AntennaSegmentDescriptor(25, 13, 0),
						new AntennaSegmentDescriptor(18, 8, 0),
						new AntennaSegmentDescriptor(15, 6, 10)
					],
					110,
					new Color(0, 190, 0)
				)]
			),
			new SegmentDescriptor(30, 14),
			new SegmentDescriptor(25, 8),
			new SegmentDescriptor(25, 6),
			new SegmentDescriptor(25, 5),
			new SegmentDescriptor(13, 4),
			new SegmentDescriptor(13, 3),
			new SegmentDescriptor(12, 3),
			new SegmentDescriptor(6, 2)
		],
		new Color(0, 190, 0)
	);
	const fish = new AnimalDescriptor(
		new Point(width / 2, height / 2),
		[
			new SegmentDescriptor(0, 18, [new EyeDescriptor(100, 16, 20, new Color(0, 0, 100), Bodypart.BOTTOM)]),
			new SegmentDescriptor(22, 30),
			new SegmentDescriptor(33, 34,
				[
					new SideFinDescriptor(40, 12, 20, new Color(0, 0, 140)),
					new BackFinDescriptor(3, new Color(0, 0, 140))
				]
			),
			new SegmentDescriptor(27, 36),
			new SegmentDescriptor(32, 32),
			new SegmentDescriptor(25, 25),
			new SegmentDescriptor(30, 14),
			new SegmentDescriptor(20, 8),
			new SegmentDescriptor(15, 5),
			new SegmentDescriptor(10, 2, [new TailFinDescriptor([20, 15, 10], new Color(0, 0, 140))])
		],
		new Color(20, 130, 255)
	);

	const FPS = 60;
	const speedInPixels = 6;
	const animal = fish.create();

	setInterval(() => { animationLoop(animal, Math.floor((60 / FPS) * speedInPixels)); }, Math.floor(1000 / FPS));
}