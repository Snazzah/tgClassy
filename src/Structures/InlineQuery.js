const User = require("./User");
const InlineLocation = require("./InlineLocation");

class InlineQuery {
	constructor(data, bot){
		this.id = data.id;
		this.offset = data.offset;
		this.query = data.query;
		this.bot = bot;
		this.from = new User(data.from, bot);
		this.location = data.location ? new InlineLocation(data.location, bot, this) : null;
	}

	answer(answer){
		answer = answer && typeof answer.build === 'function' ? answer.build() : answer;
		return this.bot.fancy.answerInlineQuery(this.id, answer.results, answer);
	}
}

module.exports = InlineQuery;