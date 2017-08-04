class Contact {
	constructor(data, message){
		this.message = message;
		this.phoneNumber = data.phone_number;
		this.firstName = data.first_name;
		this.lastName = data.last_name;
		this.userID = data.user_id;
	}

	sendTo(chat){
		return chat.sendContact(this);
	}
}

module.exports = Contact;