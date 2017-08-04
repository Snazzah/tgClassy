const User = require("./User");

class MessageEntity {
	constructor(data, bot, message){
		this.type = data.type;
		this.message = message;
		this.offset = data.offset;
		this.length = data.length;
		this.url = data.url;
		this.user = this.user ? new User(data.user, bot) : null;
	}
}

module.exports = MessageEntity;