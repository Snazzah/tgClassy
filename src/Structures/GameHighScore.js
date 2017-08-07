const User = require("./User");
const Message = require("./Message");

const Parser = require("../Utils/Parser");

class GameHighScore {
	constructor(data, bot){
		this.bot = bot;
		this.position = data.position;
		this.user = new User(data.user, bot);
		this.score = data.score;
	}

	setScore(user, message, score, opts) {
	    return new Promise((resolve, reject) => {
			user = user.id || user;
			opts = Parser.parseGameSetScoreOptions(opts);
			if(message instanceof InlineMessage) opts.inline_message_id = message.id;
				else {
					opts.message_id = message.id;
					opts.chat_id = message.chat.id;
				}
			this.bot.fancy.getGameHighScores(user, opts).then(msg => {
				if(msg === true) return resolve();
				resolve(new Message(msg, this.bot));
			}).catch(reject);
		});
	}
}

module.exports = GameHighScore;