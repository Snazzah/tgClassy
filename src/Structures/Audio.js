const File = require("./File");

/**
 * Represents a Audio file in Telegram.
 * @see https://core.telegram.org/bots/api#audio
 * @extends File
 */
class Audio extends File {
	constructor(data, bot, message){
		super(data, bot, message);

		/**
		 * The duration of the audio. (in seconds)
		 * @type {number}
		 */
		this.duration = data.duration;

		/**
		 * The performer of the audio. (as defined by sender or by audio tags)
		 * @type {?string}
		 */
		this.performer = data.performer;

		/**
		 * The title of the audio. (as defined by sender or by audio tags)
		 * @type {?string}
		 */
		this.title = data.title;

		/**
		 * The MIME type of the audio.
		 * @type {?string}
		 */
		this.mimeType = data.mime_type;
	}

	/**
	 * Sends the audio to a specified chat.
	 * @param {Chat} chat The chat to send the file in
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 */
	sendTo(chat, options){
		return chat.sendAudio(this, options);
	}
}

module.exports = Audio;