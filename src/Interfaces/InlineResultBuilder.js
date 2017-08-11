const { Parser } = require("../Utils");

class InlineResultBuilder {
	constructor(inlinequery){
		this.iq = inlinequery;
		this.bot = inlinequery.bot;
		this.results = [];
		this.cacheTime = 300;
		this.isPersonal = false;
		this.switchPMText = false;
	}

	addResult(result){
		this.results.push(Parser.parseInlineResult(result, this.results.length));
		return this;
	}

	setCacheTime(cacheTime){
		this.cacheTime = cacheTime;
		return this;
	}

	setIsPersonal(isPersonal){
		this.isPersonal = isPersonal;
		return this;
	}

	setNextOffset(nextOffset){
		this.nextOffset = nextOffset;
		return this;
	}

	setSwitchPMText(switchPMText){
		this.switchPMText = switchPMText;
		return this;
	}

	setSwitchPMParameter(switchPMParameter){
		this.switchPMParameter = switchPMParameter;
		return this;
	}

	addKeyboard(keyboardmarkup){
		if(!(keyboardmarkup instanceof Array) && !keyboardmarkup.inline_keyboard) throw new Error("Given keyboard is not inline!");
		if(!this.results[this.results.length-1]) throw new Error("Could not find last result!");
		this.results[this.results.length-1].reply_markup = keyboardmarkup.inline_keyboard ? keyboardmarkup : { inline_keyboard: keyboardmarkup };
		return this;
	}

	answer(){
		let answer = this.build();
		return this.bot.fancy.answerInlineQuery(this.iq.id, answer.results, answer)
	}

	build(){
		return {
			inline_query_id: this.iq.id,
			results: this.results,
			cache_time: this.cacheTime,
			is_personal: this.isPersonal,
			next_offset: this.nextOffset,
			switch_pm_text: this.switchPMText,
			switch_pm_parameter: this.switchPMParameter
		};
	}
}

module.exports = InlineResultBuilder;