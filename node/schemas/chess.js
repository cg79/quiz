module.exports = function(mongoose) {
	var openingSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		name: String,
		moves: [{type:String}],
		player_wins: Number,
		opponent_wins: Number,
		draws:Number,
		mas:String,
		nodeLength:Number,
		fen:String
	});

	var openingTreeSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		name: String,
		moves: [{type:String}],
		player_wins: Number,
		opponent_wins: Number,
		draws:Number,
		mas:String,
		nodeLength:Number,
		children:[openingSchema]
	});

	// declare seat covers here too
	//privacy:int, --//0 public, 1 private (just for me), 2 (shared with my friends), 4 (shared with a list of my friends), 8 (shared with a list of public persons) 
	//country:[], --//0 all
	var models = {
		Openings: mongoose.model('Opening', openingSchema),
		OpeningsTree: mongoose.model('OpeningsTree', openingTreeSchema)
	};
	return models;
}