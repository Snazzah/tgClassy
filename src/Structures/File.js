/* jshint unused: false */
class File {
	constructor(data, bot, message){
		this.id = data.file_id;
		this.bot = bot;
		this.size = data.file_size;
		this.path = data.file_path;
		this.message = message;
	}

	fetchUrl() {
	    return new Promise((resolve, reject) => {
			this.bot.getFileLink(this.id).then(url => {
				resolve(url);
			}).catch(reject);
		});
	}

	download(path) {
	    return new Promise((resolve, reject) => {
			this.bot.downloadFile(this.id, path).then(res => {
				resolve(res);
			}).catch(reject);
		});
	}

	fetch(path) {
	    return new Promise((resolve, reject) => {
			this.bot.getFile(this.id).then(res => {
				resolve(new File(res));
			}).catch(reject);
		});
	}
}

module.exports = File;