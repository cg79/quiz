module.exports = function(mongoose) {
	var domainSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		guid: String,
		name: String,
		languageId: Number,
		level: Number,
		isPublic: Boolean,
		parentGuid: String
	});

	// declare seat covers here too
	//privacy:int, --//0 public, 1 private (just for me), 2 (shared with my friends), 4 (shared with a list of my friends), 8 (shared with a list of public persons) 
	//country:[], --//0 all
	var models = {
		Domains: mongoose.model('Domain', domainSchema)
	};
	return models;
}