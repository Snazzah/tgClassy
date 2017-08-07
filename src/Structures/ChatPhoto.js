class ChatPhoto {
	constructor(data, bot, chat){
		this.smallFileID = data.small_file_id;
		this.bigFileID = data.big_file_id;
		this.chat = chat;
		this.bot = bot;
	}

	fetchBigFile(){
		return this.bot.fetchFile(this.bigFileID);
	}

	fetchSmallFile(){
		return this.bot.fetchFile(this.smallFileID);
	}
}

module.exports = ChatPhoto;