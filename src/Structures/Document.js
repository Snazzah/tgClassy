const File = require("./File");
const PhotoSize = require("./PhotoSize");

class Document extends File {
	constructor(data, bot, message){
		super(data, bot, message);
		this.name = data.file_name;
		this.mimeType = data.mime_type;
		this.thumbnail = new PhotoSize(data.thumb, bot, message);
	}

	sendTo(chat, options){
		return chat.sendDocument(this, options);
	}
}

module.exports = Document;