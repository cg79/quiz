module.exports = function(mongoose) {
	var ratingSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		domainGuid: String,
		userGuid: String,
		answerCount: Number,
		correctAnswerCount: Number,
		wrongAnswerCount: Number
	});

	var answerSchema = new mongoose.Schema({
		guid: String,
		questionGuid:String,
		definition: String,
		isCorrect: Boolean,
		imgUrl:String
	});

	var quizQuestionSchema = new mongoose.Schema({
		guid: String,
		domainGuid:String,
		questionType:Number,
		definition: String,
		imgUrl: String,
		addedDate:Date,
		addedBy: String,
		validatedBy: String,
		validatedDate:Date,
		answers:[answerSchema],
		answerGuid:String,
		answerValue:String,
		languageId:Number
	});
	// declare seat covers here too
	//privacy:int, --//0 public, 1 private (just for me), 2 (shared with my friends), 4 (shared with a list of my friends), 8 (shared with a list of public persons) 
	//country:[], --//0 all
	var models = {
		Ratings: mongoose.model('Rating', ratingSchema),
		Answers: mongoose.model('Answer', answerSchema),
		Questions: mongoose.model('Question', quizQuestionSchema)
	};
	return models;
}