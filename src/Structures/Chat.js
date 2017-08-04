const ChatMember = require("./ChatMember");
const Message = require("./Message");

const Parser = require("../Utils/Parser");

class Chat {
	constructor(data, bot){
		this.id = data.id;
		this.type = data.type;
		this.title = data.title;
		this.bot = bot;
		this.username = data.username;
		this.firstName = data.first_name;
		this.lastName = data.last_name;
		this.allMembersAreAdministrators = data.all_members_are_administrators;

		bot.chats.set(this.id, this);
	}

	send(message, options = {}){
		return new Promise((resolve, reject) => {
			this.bot.fancy.sendMessage(this.id, message, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendAudio(audio, options = {}){
		return new Promise((resolve, reject) => {
			audio = audio.id || audio;
			this.bot.fancy.sendAudio(this.id, audio, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendContact(contact, options = {}){
		return new Promise((resolve, reject) => {
			options.last_name = contact.lastName;
			this.bot.fancy.sendContact(this.id, contact.phoneNumber, contact.firstName, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendSticker(sticker, options = {}){
		return new Promise((resolve, reject) => {
			sticker = sticker.id || sticker;
			this.bot.fancy.sendSticker(this.id, sticker, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendDocument(document, options = {}){
		return new Promise((resolve, reject) => {
			document = document.id || document;
			this.bot.fancy.sendDocument(this.id, document, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendVideo(video, options = {}){
		return new Promise((resolve, reject) => {
			video = video.id || video;
			this.bot.fancy.sendVideo(this.id, video, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendVoice(voice, options = {}){
		return new Promise((resolve, reject) => {
			voice = voice.id || voice;
			this.bot.fancy.sendVoice(this.id, voice, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

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

	sendLocation(location, options = {}){
		return new Promise((resolve, reject) => {
			this.bot.fancy.sendLocation(this.id, location.latitude, location.longitude, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	sendPhoto(photo, options = {}){
		return new Promise((resolve, reject) => {
			photo = photo.id || photo;
			this.bot.fancy.sendPhoto(this.id, photo, Parser.parseMessageOptions(options)).then(m => {
				resolve(Parser.parseMessageSendResponse(m, this.bot));
			}).catch(reject);
		});
	}

	leave(){
		return new Promise((resolve, reject) => {
			this.bot.fancy.leaveChat(this.id).then(() => {
				this.bot.chats.delete(this.id);
				resolve();
			}).catch(reject);
		});
	}

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
		return this.bot.fancy._request('setChatTitle', { qs: { chat_id: this.id, title: title } });
	}

	setDescription(description) {
		return this.bot.fancy._request('setChatDescription', { qs: { chat_id: this.id, description: description } });
	}

	deletePhoto() {
		return this.bot.fancy._request('deleteChatPhoto', { qs: { chat_id: this.id } });
	}

	setPhoto(photo) {
		photo = photo.id || photo;
		const sendData = this.bot.fancy._formatSendData('photo', photo);
		return this.bot.fancy._request('setChatPhoto', { qs: { chat_id: this.id, photo: sendData[1] }, formData: sendData[0] });
	}

	exportInviteLink() {
		return this.bot.fancy._request('exportChatInviteLink', { qs: { chat_id: this.id } });
	}
}

module.exports = Chat;