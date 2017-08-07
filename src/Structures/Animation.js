const File = require("./File");
const PhotoSize = require("./PhotoSize");

class Animation extends File {
	constructor(data, bot){
		super(data, bot);
		this.name = data.file_name;
		this.mimeType = data.mime_type;
		this.thumbnail = new PhotoSize(data.thumb, bot);
	}
}

module.exports = Animation;