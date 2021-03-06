const ChatMember = require("./ChatMember");
const ChatPhoto = require("./ChatPhoto");

const Parser = require("../Utils/Parser");

/**
 * Options provided when sending a message.
 * @typedef {Object} MessageOptions
 * @property {Message|number} [replyTo] The message to refer to when sending the message
 * @property {boolean} [disableWebPagePreview] Whether or not to disable link previews for links in this message
 * @property {string} [parseMode] The formatting option for this message
 * (see {@link https://core.telegram.org/bots/api#formatting-options})
 * @property {object} [replyMarkup] The keyboard to send with the message,
 * can be generated with a {@link KeyboardBuilder}.
 */

/**
 * Options provided when editing a message.
 * @typedef {Object} MessageEditOptions
 * @property {boolean} [disableWebPagePreview] Whether or not to disable link previews for links in this message
 * @property {string} [parseMode] The formatting option for this message
 * (see [here](https://core.telegram.org/bots/api#formatting-options)
 * @property {object} [replyMarkup] The keyboard to send with the message,
 * can be generated with a {@link KeyboardBuilder}.
 */

/**
 * A venue object
 * @typedef {Object} VenueObject
 * @property {float} [latitude] Latitude of location
 * @property {float} [longitude] Longitude of location
 * @property {string} [name] The name of the venue
 * @property {string} [address] The address of the venue
 */

/**
 * A location object
 * @typedef {Object} LocationObject
 * @property {float} [latitude] Latitude of location
 * @property {float} [longitude] Longitude of location
 */

/**
 * A contact object
 * @typedef {Object} ContactObject
 * @property {float} [phoneNumber] Contact's phone number
 * @property {float} [firstName] Contact's first name
 */

/**
 * Represents a Chat query in Telegram.
 * @see https://core.telegram.org/bots/api#chat
 */
class Chat {
	constructor(data, bot){
		/**
		 * The chat's ID.
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * The type of chat this is.
		 * @type {string}
		 */
		this.type = data.type;

		/**
		 * The title of the chat, for supergroups, channels and group chats
		 * @type {?string}
		 */
		this.title = data.title;

		this.bot = bot;

		/**
		 * The username associated to the chat, for private chats, supergroups and channels if available
		 * @type {?string}
		 */
		this.username = data.username;

		/**
		 * First name of the other party in a private chat
		 * @type {?string}
		 */
		this.firstName = data.first_name;

		/**
		 * Last name of the other party in a private chat
		 * @type {?string}
		 */
		this.lastName = data.last_name;

		/**
		 * Whether or not if a group has ‘All Members Are Admins’ enabled.
		 * @type {boolean}
		 */
		this.allMembersAreAdministrators = data.all_members_are_administrators;

		/**
		 * The chat photo. Returned only in getChat.
		 * @type {?ChatPhoto}
		 */
		this.photo = this.photo ? new ChatPhoto(this.photo, bot, this) : null;

		bot.chats.set(this.id, this);
	}

	/**
	 * Sends a text message to the chat.
	 * @param {string} message The message to send.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message|Array<Message>>}
	 * @see https://core.telegram.org/bots/api#sendmessage
	 */
	send(message, options = {}){
		return new Promise((resolve, reject) => {
			this.bot.fancy.sendMessage(this.id, message, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Send chat action.
	 * `typing` for text messages,
	 * `upload_photo` for photos, `record_video` or `upload_video` for videos,
	 * `record_audio` or `upload_audio` for audio files, `upload_document` for general files,
	 * `find_location` for location data.
	 *
	 * @param {string} action Type of action to broadcast.
	 * @return {Promise}
	 * @see https://core.telegram.org/bots/api#sendmessage
	 */
	sendAction(action){
		return this.bot.fancy.sendChatAction(this.id, action)
	}

	/**
	 * Sends an audio file to the chat.
	 * @param {Audio|String|stream.Stream|Buffer} audio A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendaudio
	 */
	sendAudio(audio, options = {}){
		return new Promise((resolve, reject) => {
			audio = audio.id || audio;
			this.bot.fancy.sendAudio(this.id, audio, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a contact to the chat.
	 * @param {Contact|ContactObject} contact The contact to send.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendcontact
	 */
	sendContact(contact, options = {}){
		return new Promise((resolve, reject) => {
			options.last_name = contact.lastName;
			this.bot.fancy.sendContact(this.id, contact.phoneNumber, contact.firstName, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a .webp Sticker in the chat.
	 * @param {Sticker|String|stream.Stream|Buffer} sticker A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendsticker
	 */
	sendSticker(sticker, options = {}){
		return new Promise((resolve, reject) => {
			sticker = sticker.id || sticker;
			this.bot.fancy.sendSticker(this.id, sticker, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a document to the chat.
	 * @param {Document|String|stream.Stream|Buffer} document A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#senddocument
	 */
	sendDocument(document, options = {}){
		return new Promise((resolve, reject) => {
			document = document.id || document;
			this.bot.fancy.sendDocument(this.id, document, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a video to the chat.
	 * @param {Video|String|stream.Stream|Buffer} video A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendvideo
	 */
	sendVideo(video, options = {}){
		return new Promise((resolve, reject) => {
			video = video.id || video;
			this.bot.fancy.sendVideo(this.id, video, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a voice file to the chat.
	 * @param {Voice|String|stream.Stream|Buffer} voice A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendvoice
	 */
	sendVoice(voice, options = {}){
		return new Promise((resolve, reject) => {
			voice = voice.id || voice;
			this.bot.fancy.sendVoice(this.id, voice, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a venue to the chat.
	 * @param {Venue|VenueObject} venue A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendvenue
	 */
	sendVenue(venue, options = {}){
		return new Promise((resolve, reject) => {
			if(venue.location){
				venue.latitude = venue.location.latitude;
				venue.longitude = venue.location.longitude;
			}
			this.bot.fancy.sendVenue(this.id, venue.latitude, venue.longitude, venue.title, venue.address, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a location to the chat.
	 * @param {Location|LocationObject} location The location to send
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendlocation
	 */
	sendLocation(location, options = {}){
		return new Promise((resolve, reject) => {
			this.bot.fancy.sendLocation(this.id, location.latitude, location.longitude, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a photo to the chat.
	 * @param {Photo|String|stream.Stream|Buffer} photo A file path, Stream or Buffer.
	 * Can also be a `file_id` previously uploaded.
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendphoto
	 */
	sendPhoto(photo, options = {}){
		return new Promise((resolve, reject) => {
			photo = photo.id || photo;
			this.bot.fancy.sendPhoto(this.id, photo, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Sends a photo to the chat.
	 * @param {User|number} user The user to send the game to.
	 * @param {string} name The name of the game
	 * @param {MessageOptions} options Options for the message
	 * @return {Promise<Message>}
	 * @see https://core.telegram.org/bots/api#sendgame
	 */
	sendGame(user, name, options = {}){
		return new Promise((resolve, reject) => {
			user = user.id || user;
			options.user_id = user;
			this.bot.fancy.sendGame(this.id, name, Parser.parseGameSendOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	/**
	 * Leaves the chat.
	 * @return {Promise}
	 * @see https://core.telegram.org/bots/api#leavechat
	 */
	leave(){
		return new Promise((resolve, reject) => {
			this.bot.fancy.leaveChat(this.id).then(() => {
				this.bot.chats.delete(this.id);
				resolve();
			}).catch(reject);
		});
	}

	/**
	 * Forwards a message to this chat.
	 * @param {Message} message Message to forward.
	 * @param {boolean} disablenotif Sends the message silently. Users will receive a notification with no sound.
	 * @return {Promise}
	 * @see https://core.telegram.org/bots/api#forwardmessage
	 */
	forwardHere(message, disablenotif) {
		return this.bot.fancy.forwardMessage(this.chat.id, message.chat.id, message.id, { disable_notification: disablenotif });
	}

	fetchMember(user) {
		return new Promise((resolve, reject) => {
			user = user.id || user;
			this.bot.fancy.getChatMember(this.id, user).then(m => {
				resolve(new ChatMember(m, this.bot, this));
			}).catch(reject);
		});
	}

	fetchMe() {
		return new Promise((resolve, reject) => {
			this.bot.fancy.getChatMember(this.id, this.bot.me.id).then(m => {
				resolve(new ChatMember(m, this.bot, this));
			}).catch(reject);
		});
	}

	fetchCount() {
		return new Promise((resolve, reject) => {
			this.bot.fancy.getChatMembersCount(this.id).then(m => {
				this.memberCount = m;
				resolve(m);
			}).catch(reject);
		});
	}

	fetchAdmins() {
		return new Promise((resolve, reject) => {
			this.bot.fancy.getChatAdministrators(this.id).then(admins => {
				resolve(admins.map(m=>new ChatMember(m, this.bot, this)));
			}).catch(reject);
		});
	}

	pin(message) {
		message = message.id || message;
		return this.bot.pinChatMessage(this.id, message);
	}

	unpin() {
		return this.bot.unpinChatMessage(this.id);
	}

	setTitle(title) {
		return this.bot._request('setChatTitle', { qs: { chat_id: this.id, title: title } });
	}

	setDescription(description) {
		return this.bot._request('setChatDescription', { qs: { chat_id: this.id, description: description } });
	}

	deletePhoto() {
		return this.bot._request('deleteChatPhoto', { qs: { chat_id: this.id } });
	}

	setPhoto(photo) {
		photo = photo.id || photo;
		const sendData = this.bot.fancy._formatSendData('photo', photo);
		return this.bot._request('setChatPhoto', { qs: { chat_id: this.id, photo: sendData[1] }, formData: sendData[0] });
	}

	exportInviteLink() {
		return this.bot._request('exportChatInviteLink', { qs: { chat_id: this.id } });
	}
}

module.exports = Chat;