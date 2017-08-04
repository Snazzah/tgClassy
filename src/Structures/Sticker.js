const PhotoSize = require("./PhotoSize");
const MaskPosition = require("./MaskPosition");

class Sticker extends PhotoSize {
	constructor(data, bot, message, set){
		super(data, bot, message);
		this.setName = data.set_name;
		this.set = set;
		this.emoji = data.emoji;
		this.thumbnail = new PhotoSize(data.thumb, bot, message);
		this.maskPosition = data.mask_position ? new MaskPosition(data.mask_position, this) : null;
	}

	sendTo(chat, options){
		return chat.sendSticker(this, options);
	}

	fetchSet(){
		return new Promise((resolve, reject) => {
			this.bot.fancy._request('getStickerSet', {
				qs: {
					name: this.setName
				}
			}).then(set => {
				resolve(new this.bot.structures.StickerSet(set, this.bot));
			}).catch(reject);
		});
	}

	delete(){
		return this.bot.fancy._request('deleteStickerFromSet', { qs: { sticker: super.id } });
	}

	setPosition(position){
		return this.bot.fancy._request('setStickerPositionInSet', { qs: { sticker: super.id, position: position } });
	}
}

module.exports = Sticker;