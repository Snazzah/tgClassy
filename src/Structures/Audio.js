const File = require("./File");

class Audio extends File {
	constructor(data, bot, message){
		super(data, bot, message);
		this.duration = data.duration;
		this.performer = data.performer;
		this.title = data.title;
		this.mimeType = data.mime_type;
	}

	sendTo(chat, options){
		return chat.sendAudio(this, options);
	}
}

module.exports = Audio;