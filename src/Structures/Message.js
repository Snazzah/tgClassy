const Audio = require("./Audio");
const Chat = require("./Chat");
const Contact = require("./Contact");
const Document = require("./Document");
const Location = require("./Location");
const MessageEntity = require("./MessageEntity");
const PhotoSize = require("./PhotoSize");
const Sticker = require("./Sticker");
const User = require("./User");
const Venue = require("./Venue");
const Video = require("./Video");
const VideoNote = require("./VideoNote");
const Voice = require("./Voice");

const Parser = require("../Utils/Parser");

class Message {
	constructor(data, bot){
		this.id = data.message_id;
		this.bot = bot;
		this.chat = new Chat(data.chat, this.bot);
		this.user = data.from ? new User(data.from, bot) : null;
		this.createdAt = new Date(data.date);
		this.createdTimestamp = data.date;
		this.editedAt = new Date(data.edit_date);
		this.editedTimestamp = data.edit_date;
		this.text = data.text;
		this.service = false;

		this.audio = data.audio ? new Audio(data.audio, bot, this) : null;
		this.document = data.document ? new Document(data.document, bot, this) : null;
		this.photos = data.photo ? data.photo.map(p=>new PhotoSize(p, bot, this)) : null;
		this.video = data.video ? new Video(data.video, bot, this) : null;
		this.voice = data.voice ? new Voice(data.voice, bot, this) : null;
		this.videoNote = data.video_note ? new VideoNote(data.video_note, bot, this) : null;
		this.contact = data.contact ? new Contact(data.contact, bot, this) : null;
		this.location = data.location ? new Location(data.location, bot, this) : null;
		this.venue = data.venue ? new Venue(data.venue, bot, this) : null;
		this.sticker = data.sticker ? new Sticker(data.sticker, bot, this) : null;
		this.messageRepliedFrom = data.reply_to_message ? new Message(data.reply_to_message, bot) : null;
		this.caption = data.caption;
		this.forwardedMessage = data.forward_from_message_id ? new ForwardedMessage(data, bot) : null;
		this.entities = data.entities ? data.entities.map(e=>new MessageEntity(e, bot, this)) : null;
	}

	pin(disablenotif) {
		return this.bot.pinChatMessage(this.chat.id, this.id, disablenotif);
	}

	pinAt(chat, disablenotif) {
		return this.bot.pinChatMessage(chat.id, this.id, disablenotif);
	}

	delete() {
		return this.bot._request('deleteMessage', { qs: { chat_id: this.chat.id, message_id: this.id } });
	}

	forward(chat, disablenotif) {
		return this.bot.fancy.forwardMessage(chat.id, this.chat.id, this.id, { disable_notification: disablenotif });
	}

	edit(text, options) {
		options = Parser.parseEditMessageOptions(options);
		options.chat_id = this.chat.id;
		options.message_id = this.id;
		return this.bot.fancy.editMessageText(text, options);
	}

	editCaption(caption, options) {
		options = Parser.parseEditMessageOptions(options);
		options.chat_id = this.chat.id;
		options.message_id = this.id;
		return this.bot.fancy.editMessageCaption(caption, options);
	}

	editReplyMarkup(replyMarkup) {
		return this.bot.fancy.editMessageReplyMarkup(replyMarkup, { chat_id: this.chat.id, message_id: this.id });
	}
}

class ForwardedMessage extends Message {
	constructor(data, bot){
		super(data, bot);
		this.id = data.forward_from_message_id;
		this.bot = bot;
		this.user = new User(data.forward_from, bot);
		this.chat = new Chat(data.forward_from_chat, bot);
		this.createdAt = data.forward_date ? new Date(data.forward_date) : null;
		this.createdTimestamp = data.forward_date || null;
	}
}

module.exports = Message;