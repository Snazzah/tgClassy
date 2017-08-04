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

	addSticker(sticker){
		const sendData = this.bot.fancy._formatSendData('sticker', sticker.file);
		return this.bot.fancy._request('addStickerToSet', {
			qs: {
				user_id: this.bot.me.id,
				name: this.name,
				emojis: sticker.emojis,
				png_sticker: sendData[1],
				mask_position: sticker.mask_position._data || sticker.mask_position
			},
			formData: sendData[0]
		});
	}
}

module.exports = StickerSet;