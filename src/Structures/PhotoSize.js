const File = require("./File");

class PhotoSize extends File {
	constructor(data, bot, message, file){
		super(data, bot, message);
		this.width = data.width;
		this.height = data.height;
		this.file = file;
	}

	sendTo(chat, options){
		return chat.sendPhoto(this, options);
	}
}

module.exports = PhotoSize;