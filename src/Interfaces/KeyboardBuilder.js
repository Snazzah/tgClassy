class KeyboardBuilder {
	constructor(bot){
		this.bot = bot;
		this.inlineMode = false;
	}

	inline(){
		this.inlineMode = true;
		return this;
	}

	noInline(){
		this.inlineMode = false;
		return this;
	}

	setResizeKeyboard(resizeKeyboard){
		this.resizeKeyboard = resizeKeyboard;
		return this;
	}

	setOneTimeKeyboard(oneTimeKeyboard){
		this.oneTimeKeyboard = oneTimeKeyboard;
		return this;
	}

	setSelective(selective){
		this.selective = selective;
		return this;
	}

	setKeyboard(keyboard){
		this.keyboard = keyboard;
		return this;
	}

	build(){
		if(!this.keyboard) throw new Error("Could not find keyboard!");
		return this.inlineMode ? { inline_keyboard: this.keyboard } : {
			resize_keyboard: this.resizeKeyboard,
			one_time_keyboard: this.oneTimeKeyboard,
			selective: this.selective,
			keyboard: this.keyboard
		};
	}
}

module.exports = KeyboardBuilder;