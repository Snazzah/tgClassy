const { Collection } = require("../Utils");

class ButtonCaller {
	constructor(bot){
		this.bot = bot;
		this._handlers = new Collection();
		this.bot.on('callbackQuery', this.onCallback.bind(this));
	}

	add(data, cb){
		this._handlers.set(data, cb);
	}

	onCallback(cbq){
		if(!cbq.data || !cbq.message) return;
		let cb = this._handlers.get(cbq.data);
		if(cb){
			let res = cb(cbq);
			if(res === "unhook") this._handlers.delete(cbq.data);
		}
	}
}

module.exports = ButtonCaller;