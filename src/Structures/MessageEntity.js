const User = require("./User");

class MessageEntity {
	constructor(data, bot, message){
		this.type = data.type;
		this.message = message;
		this.offset = data.offset;
		this.length = data.length;
		this.text = message.text.slice(data.offset, data.length+data.offset);
		this.url = data.url;
		this.user = this.user ? new User(data.user, bot) : null;
	}
}

module.exports = MessageEntity;