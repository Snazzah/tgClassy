const User = require("./User");

class ChatMember {
	constructor(data, bot, chat){
		this.id = data.id;
		this.bot = bot;
		this.chat = chat;
		this.user = new User(data.user, bot);
		this.status = data.status;
		this.until = new Date(data.until_date);
		this.untilTimestamp = data.until_date;

		this.canBeEdited = data.can_be_edited;
		this.canChangeInfo = data.can_change_info;
		this.canPostMessages = data.can_post_messages;
		this.canEditMessages = data.can_edit_messages;
		this.canDeleteMessages = data.can_delete_messages;
		this.canInviteUsers = data.can_invite_users;
		this.canRestrictMembers = data.can_restrict_members;
		this.canPinMessages = data.can_pin_messages;
		this.canPromoteMembers = data.can_promote_members;
		this.canSendMessages = data.can_send_messages;
		this.canSendMediaMessages = data.can_send_media_messages;
		this.canSendOtherMessages = data.can_send_other_messages;
		this.canAddWebPagePreviews = data.can_add_web_page_previews;
	}

	kick() {
		return this.bot.fancy.kickChatMember(this.chat.id, this.user.id);
	}

	unban() {
		return this.bot.fancy.unbanChatMember(this.chat.id, this.user.id);
	}

	restrict(until, perms) {
		let data = { 
			qs: perms
		};
		data.qs.until = until instanceof Date ? until.valueOf() : until;
		data.qs.chat_id = this.chat.id;
		data.qs.user_id = this.user.id;
		return this.bot._request('restrictChatMember', data);
	}

	promote(until, perms) {
		let data = { 
			qs: perms
		};
		data.qs.chat_id = this.chat.id;
		data.qs.user_id = this.user.id;
		return this.bot._request('promoteChatMember', data);
	}
}

module.exports = ChatMember;