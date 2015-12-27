module.exports = function(mongoose) {

	var roomSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		guid: String,
		domainGuid:String,
		ownerGuid:String,
		name: String,
		parentGuid: String,
		isPublic:Boolean,
		game:Number
	});

	// declare seat covers here too
	//privacy:int, --//0 public, 1 private (just for me), 2 (shared with my friends), 4 (shared with a list of my friends), 8 (shared with a list of public persons) 
//country:[], --//0 all
	var models = {
		Rooms: mongoose.model('Room', roomSchema)
	};
	return models;
}