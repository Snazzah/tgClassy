const Location = require("./Location");
class InlineLocation extends Location {
	constructor(data, message, inline){
		super(data)
		this.inline = inline;
	}
}

module.exports = InlineLocation;