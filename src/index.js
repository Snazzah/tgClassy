const tgfancy = require("tgfancy");
const Structures = require("./Structures");
const { Collection } = require("./Utils");
const { ButtonCaller, ButtonBuilder, InlineResultBuilder, KeyboardBuilder, Constants } = require("./Interfaces");
const EventEmitter = require('eventemitter3');
const camelize = string => string.replace(/_\w/g, m => m[1].toUpperCase());

const nonUpdatingTypes = ['text', 'audio', 'document', 'photo', 'sticker', 'video', 'voice', 'contact', 'location'];
const updatingTypes = [
	'message', 'edited_message', 'edited_message_text', 'edited_message_caption',
	'channel_post', 'edited_channel_post', 'edited_channel_post_text', 'edited_channel_post_caption'
];
const serviceMessageProperties = [
	'new_chat_participant', 'left_chat_participant', 'new_chat_title',
	'new_chat_photo', 'delete_chat_photo', 'group_chat_created', 'supergroup_chat_created',
	'channel_chat_created', 'migrate_to_chat_id', 'migrate_from_chat_id', 'pinned_message',
	'new_chat_member', 'left_chat_member'
];

/**
 * Represents a telegram bot.
 * @constructor
 * @param {string} token - The token needed to log into the bot.
 * @param {string} options - The additional options.
 */
class ClassyTelegramBot extends EventEmitter {
	constructor(token, options){
		super();
		if(options.callbackAnswerTimeout === undefined) options.callbackAnswerTimeout = 300000; // 5 minutes
		this.fancy = new tgfancy(token, options);
		this.buttonCaller = new ButtonCaller(this);

		/**
		 * Cached chats
		 * @type {Collection<number, Chat>}
		 */
		this.chats = new Collection();

		/**
		 * Cached users
		 * @type {Collection<number, User>}
		 */
		this.users = new Collection();

		/**
		 * Cached stickerSets
		 * @type {Collection<number, StickerSet>}
		 */
		this.stickerSets = new Collection();

		/**
		 * Cached messages
		 * @type {Collection<number, StickerSet>}
		 */
		this.messages = new Collection();

		this._textRegexpCallbacks = new Collection();

		/**
		 * The bot's user object, can be undefined if the request isn't finished.
		 * @type {?User}
		 */
		this.me = undefined;
		this.fetchMe();

		updatingTypes.forEach(type => this.fancy.on(type, message => {
			let m = new Structures.Message(message, this);
			if(serviceMessageProperties.map(prop => message[prop] !== undefined).includes(true)){
				m = new Structures.ServiceMessage(message, this);
			}
			this.messages.set(m.id, m);
			this._textRegexpCallbacks.array().some(reg => {
				console.log(reg);
				const result = reg.regexp.exec(message.text);
				if (!result) return false;
				reg.callback(m, result);
				return this.options.onlyFirstMatch;
			});
			this.emit(camelize(type), m);
		}));
		nonUpdatingTypes.forEach(type => this.fancy.on(type, message => this.emit(camelize(type), new Structures.Message(message, this))));
		this.fancy.on('callback_query', message => this.emit('callbackQuery', new Structures.CallbackQuery(message, this)));
		this.fancy.on('inline_query', message => this.emit('inlineQuery', new Structures.InlineQuery(message, this)));
		this.fancy.on('chosen_inline_result', message => this.emit('chosenInlineResult', new Structures.ChosenInlineResult(message, this)));
	}

	get structures(){
		return Structures;
	}

	/**
	 * Match RegExp to incoming messages
	 * @param {RegExp} regexp The regexp to match
	 * @param {function} callback The callback to the message
	 */
	onText(regexp, callback){
		return this._textRegexpCallbacks.set(callback, { regexp, callback });
	}

	/**
	 * Unhook callbacks added with onTalk
	 * @param {function} callback The callback to the message
	 */
	unhook(callback){
		return this._textRegexpCallbacks.delete(callback);
	}

	/**
	 * Returns basic information about the bot in form of a `User` object.
	 * @return {Promise<User>}
	 * @see https://core.telegram.org/bots/api#getme
	 */
	fetchMe() {
		return new Promise((resolve, reject) => {
			this.fancy.getMe().then(user => {
				this.me = new Structures.User(user, this);
				resolve(this.me);
			}).catch(reject);
		});
	}

	createNewStickerSet(name, owner, title, sticker, containsMasks = false) {
		let data = {
			qs: {
				user_id: owner.id,
				name: `${name}_by_${this.me.username}`,
				title: title,
				contains_masks: containsMasks,
				emojis: sticker.emojis,
				mask_position: sticker.mask_position
			}
		}
		try{
			const sendData = this.fancy._formatSendData('sticker', sticker.file);
			data.formData = sendData[0];
			data.qs.png_sticker = sendData[1];
		}catch(e){
			return Promise.reject(e);
		}
		return this._request('createNewStickerSet', data);
	}

	uploadStickerFile(sticker, owner) {
		return new Promise((resolve, reject) => {
			let data ={
				qs: {
					user_id: owner.id
				}
			}
			try{
				const sendData = this._formatSendData('sticker', sticker);
				data.formData = sendData[0];
				data.qs.png_sticker = sendData[1];
			}catch(e){
				return reject(e);
			}
			this._request('uploadStickerFile', data).then(file => {
				resolve(new Structures.File(file, this));
			}).catch(reject);
		});
	}

	pinChatMessage(chatid, messageid, disablenotif) {
		return this._request('pinChatMessage', {
			qs: {
				chat_id: chatid,
				message_id: messageid,
				disable_notification: disablenotif
			}
		});
	}

	unpinChatMessage(chatid) {
		return this._request('unpinChatMessage', { qs: { chat_id: chatid } });
	}

	fetchStickerSet(name) {
		return new Promise((resolve, reject) => {
			this._request('getStickerSet', {
				qs: { name: name }
			}).then(data => {
				resolve(new Structures.StickerSet(data, this));
			}).catch(reject);
		});
	}

	fetchChat(id) {
		return new Promise((resolve, reject) => {
			this.fancy.getChat(id).then(data => {
				resolve(new Structures.Chat(data, this));
			}).catch(reject);
		});
	}

	fetchFile(id) {
		return new Promise((resolve, reject) => {
			this.fancy.getFile(id).then(data => {
				resolve(new Structures.File(data, this));
			}).catch(reject);
		});
	}

	fetchWebHookInfo(){
		return this.fancy.getWebHookInfo();
	}

	_request(endpoint, opts){
		return new Promise((resolve, reject) => {
			this.fancy._request(endpoint, opts).then(resolve).catch(e => {
				if(e.response && e.response.statusCode === 429){
					setTimeout(()=>{this._request(endpoint, opts).then(resolve).catch(reject)}, 20000);
				}else reject(e);
			})
		});
	}

	// Mirror tgFancy functions

	processUpdate(update){ return this.fancy.processUpdate(update); }
	getUpdates(form){ return this.fancy.getUpdates(form); }
	setWebHook(url, options){ return this.fancy.setWebHook(url, options); }
	hasOpenWebHook(){ return this.fancy.hasOpenWebHook(); }
	closeWebHook(){ return this.fancy.closeWebHook(); }
	openWebHook(){ return this.fancy.openWebHook(); }
	isPolling(){ return this.fancy.isPolling(); }
	stopPolling(){ return this.fancy.stopPolling(); }
	initPolling(){ return this.fancy.initPolling(); }
	startPolling(options){ return this.fancy.startPolling(options); }
}

module.exports = ClassyTelegramBot;
module.exports.Constants = Constants;
module.exports.ButtonBuilder = ButtonBuilder;
module.exports.InlineResultBuilder = InlineResultBuilder;
module.exports.KeyboardBuilder = KeyboardBuilder;