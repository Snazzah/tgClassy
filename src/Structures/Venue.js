const Location = require("./Location");

class Venue {
	constructor(data, message){
		this.message = message;
		this.title = data.title;
		this.location = new Location(data.location, message, this);
		this.address = data.address;
		this.foursquareID = data.foursquare_id;
	}

	sendTo(chat, options){
		return chat.sendVenue(this, options);
	}
}

module.exports = Venue;