const PhotoSize = require("./PhotoSize");

class UserProfilePhotos {
	constructor(data, bot){
		this.id = data.id;
		this.bot = bot;
		this.totalCount = data.total_count;
		this.photos = data.photos.map(a=>a.map(p=>new PhotoSize(p, bot)));
	}
}

module.exports = UserProfilePhotos;