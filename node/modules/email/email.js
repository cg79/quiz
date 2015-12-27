//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)



module.exports = function(renderer,nodemailer) {

	var models = {
		transporter: null,
		emailCreateUser: function(obj,to) {

			var htmlResult = renderer.render("node/templates/createuser.html", obj);

			var data = 
			{
				to:to,
				subject:"Registration",
				body:htmlResult
			};
			this.sendEmail(data);

		},
		sendEmail: function(obj) {
			// create reusable transporter object using SMTP transport
			if (this.transporter == null) {
				this.transporter = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: 'claudiu9379@gmail.com',
						pass: 'kqdduzoy9379!'
					}
				});
			}
			var mailOptions = {
				from: "claudiu", // sender address
				to: obj.to,
				subject: obj.subject, // Subject line
				html: obj.body
			};
			this.transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);
			});
		}
	};
	return models;
}