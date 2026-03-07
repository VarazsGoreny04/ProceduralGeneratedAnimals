import Color from './Color.js';
import Point from './Point.js';
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

const FPS = 60;
let stop = false;
let animals = null;
let animal = null;

window.keyPressed = () => {
	if (key === 'f')
		pause();
	else if ('0' <= key && key <= '9') {
		try {
			changeAnimal(key - '0');
		} catch (error) { }
	}
}

function animationLoop(animal, speedInPixels) {
	if (stop)
		return;

	const currentMousePosition = Point.mouse();

	if (Point.distance(currentMousePosition, animal.headSegment.origin) < speedInPixels)
		return;

	background(20, 80, 20);

	animal.step(currentMousePosition, speedInPixels);
	animal.draw();
}

function pause() {
	stop = !stop;
}

function changeAnimal(index) {
	animal = animals[index].create();

	background(20, 80, 20);
	animal.draw();
}

window.setup = () => {
	const snake = new AnimalDescriptor(
		new Point(windowWidth / 2, windowHeight / 2),
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
		22,
		new Color(190, 0, 0),
		6
	);
	const lizard = new AnimalDescriptor(
		new Point(windowWidth / 2, windowHeight / 2),
		[
			new SegmentDescriptor(0, 26, [new EyeDescriptor(115, 22, 10, new Color(0, 0, 0))]),
			new SegmentDescriptor(26, 29),
			new SegmentDescriptor(29, 20),
			new SegmentDescriptor(22, 30,
				[new LegDescriptor(
					[
						new LegSegmentDescriptor(25, 10, 0, 0),
						new LegSegmentDescriptor(18, 8, 0, 145),
						new LegSegmentDescriptor(15, 6, 0, 0,
							[
								new AntennaDescriptor(
									[
										new AntennaSegmentDescriptor(5, 3, 0),
										new AntennaSegmentDescriptor(7, 2, 0)
									],
									130,
									new Color(0, 190, 0),
									Bodypart.BOTTOM
								),
								new AntennaDescriptor(
									[
										new AntennaSegmentDescriptor(5, 3, 0),
										new AntennaSegmentDescriptor(7, 2, 0),
									],
									180,
									new Color(0, 190, 0),
									Bodypart.BOTTOM
								)
							]
						)
					],
					new Point(22, 30),
					new Color(0, 190, 0)
				)]
			),
			new SegmentDescriptor(33, 34),
			new SegmentDescriptor(27, 36),
			new SegmentDescriptor(32, 32),
			new SegmentDescriptor(25, 25,
				[new LegDescriptor(
					[
						new LegSegmentDescriptor(28, 13, 0, 0),
						new LegSegmentDescriptor(21, 8, -145, -5),
						new LegSegmentDescriptor(18, 6, 0, 0,
							[
								new AntennaDescriptor(
									[
										new AntennaSegmentDescriptor(5, 3, 0),
										new AntennaSegmentDescriptor(10, 2, 0)
									],
									140,
									new Color(0, 190, 0),
									Bodypart.BOTTOM
								),
								new AntennaDescriptor(
									[
										new AntennaSegmentDescriptor(5, 3, 0),
										new AntennaSegmentDescriptor(9, 2, 0)
									],
									180,
									new Color(0, 190, 0),
									Bodypart.BOTTOM
								)
							]
						)
					],
					new Point(18, 0),
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
		14,
		new Color(0, 190, 0),
		3
	);
	const fish = new AnimalDescriptor(
		new Point(windowWidth / 2, windowHeight / 2),
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
		20,
		new Color(20, 130, 255),
		8
	);

	animals = [snake, fish, lizard];
	changeAnimal(0);

	strokeCap(ROUND);
	strokeJoin(ROUND);
	stroke(0);

	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("canvasHolder");

	background(20, 80, 20);
	animal.draw();
	setInterval(() => { animationLoop(animal, Math.floor((60 / FPS) * animal.speed)); }, Math.floor(1000 / FPS));
}

window.windowResized = () => {
	resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("snakeButton").addEventListener("click", () => changeAnimal(0));
	document.getElementById("fishButton").addEventListener("click", () => changeAnimal(1));
	document.getElementById("lizardButton").addEventListener("click", () => changeAnimal(2));
	document.getElementById("pauseButton").addEventListener("click", pause);
});