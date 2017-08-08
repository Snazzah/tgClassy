const UserProfilePhotos = require("./UserProfilePhotos");

class User {
	constructor(data, bot){
		this.id = data.id;
		this.bot = bot;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.username = data.username;
		this.language = data.language_code;

		bot.users.set(this.id, this);
	}

	fetchUserProfilePhotos(options){
		return new Promise((resolve, reject) => {
			this.bot.fancy.getUserProfilePhotos(this.id, options).then(set => {
				resolve(new UserProfilePhotos(set, this.bot));
			}).catch(reject);
		});
	}
}

module.exports = User;