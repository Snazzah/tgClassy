const User = require("./User");
const Message = require("./Message");
const InlineMessage = require("./InlineMessage");

const Parser = require("../Utils/Parser");

/**
 * Options provided when answering a {@link CallbackQuery}.
 * @typedef {Object} CallbackQueryAnswerOptions
 * @property {number} [cacheTime] The maximum amount of time in seconds that the result of
 * the callback query may be cached client-side.
 * @property {string} [url] URL that will be opened by the user's client.
 */

/**
 * Represents a Callback query in Telegram.
 * @see https://core.telegram.org/bots/api#callbackquery
 */
class CallbackQuery {
	constructor(data, bot){
		/**
		 * The query's ID.
		 * @type {string}
		 */
		this.id = data.id;
		this.bot = bot;

		/**
		 * The user that called the query.
		 * @type {User}
		 */
		this.user = new User(data.from, bot);

		/**
		 * The message that the callback originated from.
		 * @type {?Message|InlineMessage}
		 */
		this.message = data.message ? new Message(data.message, bot) : (data.inline_message_id ? new InlineMessage(data.inline_message_id, bot) : null);

		/**
		 * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent.
		 * @type {string}
		 */
		this.chatInstance = data.chat_instance;

		/**
		 * Data associated with the callback button.
		 * @type {string}
		 */
		this.data = data.data;

		/**
		 * Short name of a Game to be returned.
		 * @type {string}
		 */
		this.gameShortName = data.game_short_name;

		if(bot.fancy.options.callbackAnswerTimeout || bot.fancy.options.callbackAnswerTimeout !== 0){
			this.timeout = setTimeout(this.answer.bind(this), bot.fancy.options.callbackAnswerTimeout)
		}
	}

	/**
	 * Answer to the callback query.
	 * @param {string} text The text to show in the notification.
	 * @param {boolean} showAlert Whether or not to show the notification an an alert.
	 * @param {CallbackQueryAnswerOptions} options Options for the answer
	 * @return {Promise}
	 */
	answer(text, showAlert, options){
		clearTimeout(this.timeout);
		return this.bot.fancy.answerCallbackQuery(this.id, text, showAlert, Parser.parseCallbackQueryAnswerOptions(options))
	}
}
module.exports = CallbackQuery;