module.exports = function(mongoose) {
	var userSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		guid: String,
		name: String,
		password: String,
		email: String,
		salt: String,
		firstName: String,
		lastName: String,
		avatar:String
	});


	// declare seat covers here too
	//privacy:int, --//0 public, 1 private (just for me), 2 (shared with my friends), 4 (shared with a list of my friends), 8 (shared with a list of public persons) 
//country:[], --//0 all
	var models = {
		Users: mongoose.model('User', userSchema)
	};
	return models;
}