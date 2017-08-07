const PhotoSize = require("./PhotoSize");
const MessageEntity = require("./MessageEntity");
const Animation = require("./Animation");
const InlineMessage = require("./InlineMessage");
const GameHighScore = require("./GameHighScore");
const Message = require("./Message");

const Parser = require("../Utils/Parser");

class Game {
	constructor(data, bot){
		this.title = data.title;
		this.bot = bot;
		this.text = data.text;
		this.description = data.description;
		this.photo = data.photo.map(ps => new PhotoSize(ps, bot));
		this.text_entities = data.text_entities ? data.text_entities.map(ent => new MessageEntity(ent, bot)) : null;
		this.animation = this.animation ? new Animation(this.animation, bot) : null;
	}

	fetchHighScores(user, message) {
	    return new Promise((resolve, reject) => {
			user = user.id || user;
			let data = {};
			if(message instanceof InlineMessage) data.inline_message_id = message.id;
				else data = {
					message_id: message.id,
					chat_id: message.chat.id
				}
			this.bot.fancy.getGameHighScores(user, data).then(scores => {
				resolve(scores.map(score => new GameHighScore(score, this.bot)));
			}).catch(reject);
		});
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

module.exports = Game;