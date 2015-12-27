module.exports = function(mongoQuery, encryption) {

	var models = {
		getRandomQuestions: function(obj, res) {
			console.log("ok");

			// var query = mongoQuery.schemas.Rooms.find({
			//     'level': 0
			// });

			// mongoQuery.executeQuery(query)
			//     .then(function(recordset) {
			//         console.log(recordset.length);
			//         if (recordset.length == 0) {
			//             var room = {
			//                 country : 1,//romania
			//                 name:"Matematica",
			//                 level:0,
			//                 isPublic:true,
			//                 game:1//quiz
			//             };
			//             models.addRoom(room, null);
			//         }
			//         if (recordset.length > 0) {
			//             console.log(recordset);

			//             return mongoQuery.result(true, "name", recordset, res);
			//         }
			//         return mongoQuery.result(false, "Invalid name or password", null, res);
			//     });

		},
		add: function(obj, res) {
			try {
				//console.log("paths");
				//console.log(obj.paths);
				console.log(obj);

				var dbQuizQuestion = new mongoQuery.quizSchemas.Questions({
					guid: encryption.guid(),
					definition: obj.definition,
					domainGuid: obj.domainGuid,
					imgUrl: obj.imgUrl,
					addedBy: obj.addedBy,
					addedDate: new Date(),

				});

				var path = "";
				if (obj.imgUrl != undefined && obj.imgUrl != "") {
					path = _.find(obj.paths, function(num) {
						return num.fName == obj.imgUrl;
					});
					if (path != undefined) {
						dbQuizQuestion.imgUrl = obj.imgdir + path.name;
					}
				}


				var dbAnswer = null;
				if (obj.answers != undefined) {
					for (var i = 0; i < obj.answers.length; i++) {
						dbAnswer = new mongoQuery.quizSchemas.Answers({
							guid: encryption.guid(),
							definition: obj.answers[i].definition,
							questionGuid: dbQuizQuestion.guid,
							isCorrect: obj.answers[i].isCorrect,
							imgUrl: obj.answers[i].imgUrl
						});
						if (obj.answers[i].imgUrl != undefined && obj.answers[i].imgUrl != "") {
							path = _.find(obj.paths, function(num) {
								return num.fName == obj.answers[i].imgUrl;
							});
							if (path != undefined) {
								dbAnswer.imgUrl = obj.imgdir + path.name;
							}
						}

						dbQuizQuestion.answers.push(dbAnswer);
					}
				}

				console.log("add quiz Question");
				dbQuizQuestion.save(function(err) {
					if (err) throw err;
					console.log('Quiz question saved successfully!');

					var query = mongoQuery.quizSchemas.Questions.find({
						'domainGuid': obj.domainGuid
					}).sort({
						$addedDate: -1
					}).limit(5);

					mongoQuery.executeQuery(query)
						.then(function(recordset) {
							console.log(recordset.length);

							if (recordset.length > 0) {
								console.log(recordset);

								return mongoQuery.result(true, "name", recordset, res);
							}
							return mongoQuery.result(true, "Invalid name or password", recordset, res);
						});
				});
			} catch (e) {
				console.log(e);
			}

		}
	};
	return models;
}