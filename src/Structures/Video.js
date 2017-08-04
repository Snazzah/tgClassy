const PhotoSize = require("./PhotoSize");

class Video extends PhotoSize {
	constructor(data, bot, message){
		super(data, bot, message);
		this.duration = data.duration;
		this.mimeType = data.mime_type;
		this.thumbnail = new PhotoSize(data.thumb, bot, message, this);
	}

	sendTo(chat, options){
		return chat.sendVideo(this, options);
	}
}

module.exports = Video;