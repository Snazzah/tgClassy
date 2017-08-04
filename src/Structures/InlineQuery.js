const User = require("./User");
const InlineLocation = require("./InlineLocation");

class InlineQuery {
	constructor(data, bot){
		this.id = data.id;
		this.bot = bot;
		this.from = new User(data.from, bot);
		this.location = data.location ? new InlineLocation(data.location, bot, this) : null;
	}

	answer(answer){
		answer = answer && answer._unravel ? answer._unravel : answer;
		return this.bot.fancy.answerInlineQuery(this.id, answer.results, answer)
	}
}

module.exports = InlineQuery;