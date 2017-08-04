const Message = require("./Message");
const User = require("./User");
const PhotoSize = require("./PhotoSize");

const serviceMessageProperties = [
	'new_chat_participant', 'left_chat_participant', 'new_chat_title',
	'new_chat_photo', 'delete_chat_photo', 'group_chat_created', 'supergroup_chat_created',
	'channel_chat_created', 'migrate_to_chat_id', 'migrate_from_chat_id', 'pinned_message',
	'new_chat_member', 'left_chat_member'
];

class ServiceMessage extends Message {
	constructor(data, bot){
		super(data, bot);
		this.service = true;
		this.serviceType = serviceMessageProperties.map(prop => `${data[prop]?"y":"n"}:${prop}`).filter(prop => prop.startsWith("n"))[0].slice(2);
		this.pinnedMessage = this.serviceType === 'pinned_message' ? new Message(data.pinned_message, bot) : null;
		this.newChatMember = this.serviceType === 'new_chat_member' ? new User(data.new_chat_member, bot) : null;
		this.leftChatMember = this.serviceType === 'left_chat_member' ? new User(data.left_chat_member, bot) : null;
		this.newChatPhoto = this.serviceType === 'new_chat_photo' ? data.new_chat_photo.map(p=>new PhotoSize(p, bot)) : null;
	}
}

module.exports = ServiceMessage;