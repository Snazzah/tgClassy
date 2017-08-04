const Parser = require("../Utils/Parser");

class InlineMessage {
	constructor(id, bot){
		this.id = id;
		this.bot = bot;
	}

	edit(text, options) {
		options = Parser.parseEditMessageOptions(options);
		options.inline_message_id = this.id;
		return this.bot.fancy.editMessageText(text, options);
	}

	editCaption(caption, options) {
		options = Parser.parseEditMessageOptions(options);
		options.inline_message_id = this.id;
		return this.bot.fancy.editMessageCaption(caption, options);
	}

	editReplyMarkup(replyMarkup) {
		return this.bot.fancy.editMessageReplyMarkup(replyMarkup, { inline_message_id: this.id });
	}
}

module.exports = InlineMessage;