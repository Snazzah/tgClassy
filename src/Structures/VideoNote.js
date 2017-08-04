const File = require("./File");
const PhotoSize = require("./PhotoSize");

const { Parser } = require("../Utils");

class VideoNote extends File {
	constructor(data, bot, message){
		super(data, bot, message);
		this.length = this.width = this.height = data.length;
		this.thumbnail = new PhotoSize(data.thumb, bot, message, this);
	}

	sendTo(chat, options){
		return new Promise((resolve, reject) => {
			let data = {
				qs: Parser.parseMessageOptions(options)
			}
			data.qs.chat_id = chat.id,
			data.qs.video_note = this.id
			this.bot._request('sendVideoNote', {
				qs: {
					chat_id: chat.id,
					video_note: this.id
				}
			}).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}
}

module.exports = VideoNote;