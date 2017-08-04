const dataCharacters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm`~1234567890!@#$%^&*()-_=+[{]}|:;,.<>/? ";
const rInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class ButtonBuilder {
	constructor(bot, iq){
		this.bot = bot;
		this.iq = iq;
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

	setText(text){
		this.text = text;
		return this;
	}

	setUrl(url){
		this.url = url;
		return this;
	}

	setText(text){
		this.text = text;
		return this;
	}

	setUrl(url){
		this.url = url;
		return this;
	}

	setCallbackData(callbackData){
		this.callbackData = callbackData;
		return this;
	}

	setSwitchInlineQuery(switchInlineQuery){
		this.switchInlineQuery = switchInlineQuery;
		return this;
	}

	setRequestContact(requestContact){
		this.requestContact = requestContact;
		return this;
	}

	setRequestLocation(requestLocation){
		this.requestLocation = requestLocation;
		return this;
	}

	setSwitchInlineQueryCurrentChat(switchInlineQueryCurrentChat){
		this.switchInlineQueryCurrentChat = switchInlineQueryCurrentChat;
		return this;
	}

	click(callback){
		this.clickCB = callback;
		return this;
	}

	generateData(){
		let data = "";
		for (var i = 0; i < 64; ++i) {
			data += dataCharacters[rInt(0,dataCharacters.length-1)];
		}
		return data;
	}

	build(){
		if(!this.text) throw new Error('Text is required!');
		//if(!(this.url || this.callbackData || this.switchInlineQuery || this.switchInlineQueryCurrentChat)) throw new Error('You must include of of the following: url, callbackData, switchInlineQuery, switchInlineQueryCurrentChat');
		if(this.callbackData && this.callbackData.length > 64) throw new Error('Callback data is over the character limit! (64)');
		this.callbackData = this.callbackData || this.generateData();
		if(this.clickCB && this.inlineMode) this.bot.buttonCaller.add(this.callbackData, this.clickCB);
		return this.inlineMode ? {
			text: this.text,
			url: this.url,
			callback_data: this.callbackData,
			switch_inline_query: this.switchInlineQuery,
			switch_inline_query_current_chat: this.switchInlineQueryCurrentChat
		} : {
			text: this.text,
			request_contact: this.requestContact,
			request_location: this.requestLocation
		};
	}
}

module.exports = ButtonBuilder;