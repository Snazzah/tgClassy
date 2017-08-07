const resultTypes = [
	'article', 'photo', 'gif', 'mpeg4_gif', 'video',
	'audio', 'voice', 'document', 'location', 'venue',
	'contact', 'game'
]

Parser = module.exports = {
	parseMessageOptions: options => {
		if(!options) return options;
		if(options.replyTo){
			options.reply_to_message_id = options.replyTo.id;
			delete options.replyTo;
		}
		return Parser.parseEditMessageOptions(options);
	},
	parseGameSendOptions: options => {
		if(!options) return options;
		if(options.replyTo){
			options.reply_to_message_id = options.replyTo.id;
			delete options.replyTo;
		}
		if(options.replyMarkup){
			options.reply_markup = options.replyMarkup;
			if(options.reply_markup === "remove") options.reply_markup = { keyboard_remove: true };
			if(options.reply_markup === "remove_selective") options.reply_markup = { keyboard_remove: true, selective: true };
			delete options.replyMarkup;
		}
		if(options.disableNotification){
			options.disable_notification = options.disableNotification;
			delete options.disableNotification;
		}
		return options;
	},
	parseGameSetScoreOptions: options => {
		if(!options) return options;
		if(options.disableEditMessage){
			options.disable_edit_message = options.disableEditMessage;
			delete options.disableEditMessage;
		}
		return options;
	},
	parseMessageSendResponse: (message, bot) => {
		if(message instanceof Array){
			return message.map(m => new bot.structures.Message(m, bot));
		}else{
			return new bot.structures.Message(message, bot);
		}
	},
	parseEditMessageOptions: options => {
		if(!options) return options;
		if(options.disableWebPagePreview){
			options.disable_web_page_preview = options.disableWebPagePreview;
			delete options.disableWebPagePreview;
		}
		if(options.parseMode){
			options.parse_mode = options.parseMode;
			delete options.parseMode;
		}
		if(options.replyMarkup){
			options.reply_markup = options.replyMarkup;
			if(options.reply_markup === "remove") options.reply_markup = { keyboard_remove: true };
			if(options.reply_markup === "remove_selective") options.reply_markup = { keyboard_remove: true, selective: true };
			delete options.replyMarkup;
		}
		return options;
	},
	parseInlineResult: (result, index) => {
		if(!resultTypes.includes(result.type)) throw new Error(`Failed check at index ${index}: Invalid type!`);
		if(!result.id) throw new Error(`Failed check at index ${index}: Invalid ID!`);
		if(result.caption && result.caption.length > 200) throw new Error(`Failed check at index ${index}: Caption is over the character limit! (200)`);
		if(result.id.length > 64) throw new Error(`Failed check at index ${index}: ID is over the character limit! (64)`);
		return result;
	},
	parseCallbackQueryAnswerOptions: options => {
		if(!options) return options;
		if(options.cacheTime){
			options.cache_time = options.cacheTime;
			delete options.cacheTime;
		}
		return options;
	}
}