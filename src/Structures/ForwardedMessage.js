const User = require("./User");
const Chat = require("./Chat");
const Message = require("./Message");

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

module.exports = ForwardedMessage;