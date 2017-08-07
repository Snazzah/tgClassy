/* jshint unused: false */
/**
 * Represents a File in Telegram.
 * @see https://core.telegram.org/bots/api#file
 */
class File {
	constructor(data, bot, message){
		/**
		 * The file's ID.
		 * @type {string}
		 */
		this.id = data.file_id;
		this.bot = bot;

		/**
		 * The file's size.
		 * @type {?string}
		 */
		this.size = data.file_size;

		/**
		 * The file's path.
		 * @type {?string}
		 */
		this.path = data.file_path;

		/**
		 * The message this file was included in, if any
		 * @type {?Message}
		 */
		this.message = message;
	}

	/**
	 * Fetches the URL of the file.
	 * @return {Promise<string>}
	 * @see https://core.telegram.org/bots/api#getfile
	 */
	fetchUrl() {
	    return new Promise((resolve, reject) => {
			this.bot.fancy.getFileLink(this.id).then(url => {
				resolve(url);
			}).catch(reject);
		});
	}

	/**
	 * Downloads the file to the specified path.
	 * @param {string} path The path to store the files in
	 * @return {Promise<string>} The file path it was downloaded to
	 * @see https://github.com/yagop/node-telegram-bot-api/blob/release/src/telegram.js#L980
	 */
	download(path) {
	    return new Promise((resolve, reject) => {
			this.bot.fancy.downloadFile(this.id, path).then(res => {
				resolve(res);
			}).catch(reject);
		});
	}
}

module.exports = File;