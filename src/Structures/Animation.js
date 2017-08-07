const File = require("./File");
const PhotoSize = require("./PhotoSize");

/**
 * Represents an Animation in Telegram.
 * @see https://core.telegram.org/bots/api#animation
 * @extends File
 */
class Animation extends File {
	constructor(data, bot){
		super(data, bot);

		/**
		 * The animation's name.
		 * @type {?string}
		 */
		this.name = data.file_name;

		/**
		 * The animation's MIME type.
		 * @type {?string}
		 */
		this.mimeType = data.mime_type;

		/**
		 * The animation's thumbnail.
		 * @type {?string}
		 */
		this.thumbnail = new PhotoSize(data.thumb, bot);
	}
}

module.exports = Animation;