const Sticker = require("./Sticker");

class StickerSet {
	constructor(data, bot){
		this.name = data.name;
		this.bot = bot;
		this.title = data.title;
		this.containsMasks = data.contains_masks;
		this.stickers = data.stickers.map(s=>new Sticker(s, bot, undefined, this));
		this.bot.stickerSets.set(this.name, this);
	}

	addSticker(sticker, owner){
		let data = {
			qs: {
				user_id: owner.id,
				name: this.name,
				emojis: sticker.emojis,
				mask_position: sticker.mask_position
			}
		}
		try{
			const sendData = this.bot.fancy._formatSendData('sticker', sticker.file);
			data.formData = sendData[0];
			data.qs.png_sticker = sendData[1];
		}catch(e){
			return Promise.reject(e);
		}
		return this.bot._request('addStickerToSet', data);
	}
}

module.exports = StickerSet;