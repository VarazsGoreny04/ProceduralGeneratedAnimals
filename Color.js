/** Decribes a color value. */
export default class Color {
	/**
	 * Creates a Color object.
	 * @param {number} r The amount of red from 0 to 255.
	 * @param {number} g The amount of green from 0 to 255.
	 * @param {number} b The amount of blue from 0 to 255.
	 * @param {number} a The alpha value from 0 to 255.
	 */
	constructor(r, g, b, a = 255) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}