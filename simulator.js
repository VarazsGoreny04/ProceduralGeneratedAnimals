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
import Segment from './Segment.js';

let stop = true;

window.keyPressed = () => {
	if (key === 'f') {
		stop = !stop;
	}
}

function animationLoop(animal, speedInPixels) {
	if (stop)
		return;

	const currentMousePosition = Point.mouse();

	if (Point.magnitude(Point.subtract(currentMousePosition, animal.headSegment.origin)) < speedInPixels)
		return;

	background(20, 80, 20);

	animal.step(currentMousePosition, speedInPixels);
	animal.draw();
}

window.setup = () => {
	/* createCanvas(1600, 800);

	const segment = new Segment(new Point(width / 2, height / 2), 0, 20);
	const leg = new LegDescriptor(
		[
			new LegSegmentDescriptor(70, 10, -70, 70),
			new LegSegmentDescriptor(70, 10, 20, 145),
			new LegSegmentDescriptor(70, 10, 0, 0),
		],
		new Color(255, 0, 0, 100)
	).create(segment);

	segment.bodyparts = [leg];

	setInterval(() => {
		if (stop)
			return;

		const mouse = Point.mouse()// new Point(random(0, width), random(0, height));
		if (leg.standsOn.x == mouse.x || leg.standsOn.y == mouse.y)
			return;

		background(20, 80, 20);
		fill(255, 0, 0);
		ellipse(segment.origin.x, segment.origin.y, 5, 5);
		ellipse(mouse.x, mouse.y, 20, 20);
		leg.standsOn = mouse;
		leg.draw();
	}, 1000 / 60);
}

function test2() { */
	/* createCanvas(1600, 800);

	const middle = new Point(width / 2, height / 2);
	const vector = new Point(1, 1);

	fill(255, 255, 255);
	ellipse(middle.x, middle.y, 10, 10);

	setInterval(() => {
		const mouse = Point.subtract(Point.mouse(), middle);
		console.log(Point.angleOfVectors(vector, mouse));
	});
}

function test1() { */
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
				[
					new LegDescriptor(
						[
							new LegSegmentDescriptor(22, 10, 0, 0),
							new LegSegmentDescriptor(15, 8, 5, 145),
							new LegSegmentDescriptor(12, 6, 0, 0)
						],
						new Color(0, 190, 0)
					)
				]
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
			new SegmentDescriptor(10, 2, [new TailFinDescriptor([10, 10, 10, 10, 10], new Color(0, 0, 140))])
		],
		new Color(20, 130, 255)
	);

	const FPS = 60;
	const speedInPixels = 4;
	const animal = lizard.create();


	background(20, 80, 20);
	animal.draw();
	setInterval(() => { animationLoop(animal, Math.floor((60 / FPS) * speedInPixels)); }, Math.floor(1000 / FPS));
}