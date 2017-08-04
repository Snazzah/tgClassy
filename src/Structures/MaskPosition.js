class MaskPosition {
	constructor(data, sticker){
		this.sticker = sticker;
		this.point = data.point;
		this.xShift = data.x_shift;
		this.yShift = data.y_shift;
		this.scale = data.scale;
		this._data = data;
	}
}

module.exports = MaskPosition;