const User = require("./User");
const InlineLocation = require("./InlineLocation");
const InlineMessage = require("./InlineMessage");

class ChosenInlineResult {
	constructor(data, bot){
		this.id = data.result_id;
		this.from = this.requester = new User(data.from, bot);
		this.location = data.location ? new InlineLocation(data.location, bot, this) : null;
		this.query = data.query;
		this.offset = data.offset;
		this.message = data.inline_message_id ? new InlineMessage(data.message_id) : null;
	}
}

module.exports = ChosenInlineResult;