const User = require("./User");
const Message = require("./Message");

const Parser = require("../Utils/Parser");

class CallbackQuery {
	constructor(data, bot){
		this.id = data.id;
		this.bot = bot;
		this.user = new User(data.from, bot);
		this.message = data.message ? new Message(data.message, bot) : null;
		this.inlineMessageID = data.inline_message_id;
		this.chatInstance = data.chat_instance;
		this.data = data.data;
		this.gameShortName = data.game_short_name;

		if(bot.fancy.options.callbackAnswerTimeout){
			this.timeout = setTimeout(this.answer.bind(this), bot.fancy.options.callbackAnswerTimeout)
		}
	}

	answer(text, showAlert, options){
		clearTimeout(this.timeout);
		return this.bot.fancy.answerCallbackQuery(this.id, text, showAlert, Parser.parseCallbackQueryAnswerOptions(options))
	}
}
module.exports = CallbackQuery;