const File = require("./File");

class Voice extends File {
	constructor(data, bot, message){
		super(data, bot, message);
		this.duration = data.duration;
		this.mimeType = data.mime_type;
	}

	sendTo(chat, options){
		return chat.sendVoice(this, options);
	}
}

module.exports = Voice;