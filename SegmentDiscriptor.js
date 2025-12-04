export default class SegmentDiscriptor {
	constructor(nextSegmentDistance, skinRadius, bodypart = undefined) {
		this.nextSegmentDistance = nextSegmentDistance;
		this.skinRadius = skinRadius;
		this.bodypart = bodypart;
	}
}