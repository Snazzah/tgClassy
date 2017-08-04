class Location {
	constructor(data, message, venue){
		this.message = message;
		this.longitude = data.longitude;
		this.latitude = data.latitude;
		this.venue = venue;
	}

	sendTo(chat, options){
		return chat.sendLocation(this, options);
	}
}

module.exports = Location;