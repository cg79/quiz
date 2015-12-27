var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	routes = require('./node/routes'),
	q = require('q'),
	jwt = require('jsonwebtoken'),
	config = require('./config'),
	//chatServer = require('./chatServer')(server),
	mongo = require('mongodb'),
	cryptoJS = require('node-cryptojs-aes').CryptoJS,
	uuid = require('uuid'),
	//multer = require('multer'),
	//multipart = require("multipart"),
	busboy = require('connect-busboy'),
	gravatar = require('gravatar'),
	underscore = require('underscore'),
	nodemailer = require('nodemailer'),
	fs = require('fs-extra'),
	util = require('util'),
	path = require('path'),
	im = require('imagemagick'),
	lwip = require('lwip'),
	gm = require('gm'),
	swig = require('swig'),
	Chess = require('chess.js').Chess,
	bodyParser = require('body-parser'),
	renderer = require('./node/modules/renderer/renderer.js')(swig),
	email=require('./node/modules/email/email.js')(renderer,nodemailer),
	uploader = require('./node/utils/upload.js')(),
	encryption = require('./node/utils/encryption.js')(cryptoJS, uuid),
	mongoQuery = require('./node/utils/mongoQuery.js')(q),
	roomModule = require('./node/modules/room/room.js')(mongoQuery, encryption),
	domainModule = require('./node/modules/domain/domain.js')(mongoQuery, encryption),
	quizQuestionsModule = require('./node/modules/quizquestions/quiz.questions.js')(mongoQuery, encryption),
	security = require('./node/modules/security/security.js')(mongoQuery, encryption, jwt,email),
	chessModule = require('./node/modules/chess/chess.js')(mongoQuery, encryption, fs,Chess);

var done = false;

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3001);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || 'localhost');
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use('/components', express.static(__dirname + '/components'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/icons', express.static(__dirname + '/icons'));
app.use(busboy());

var chess = new Chess();
chess.move('e4');
var l = chess.ascii();
console.log(l);
l=chess.fen();
console.log(l);

//app.use(app.router);
app.set('view engine', 'ejs');
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', routes.index);

app.post('/security', function(request, response) {
	console.log(request.body);

	response.end(JSON.stringify(request.body));
});
app.post('/security/:id', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log(req.params.id + " " + JSON.stringify(req.body));
	security[req.params.id](req.body, res);
});

app.post('/room/:id', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log(req.params.id + " " + JSON.stringify(req.body));
	roomModule[req.params.id](req.body, res);
});

app.post('/chess/:id', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log(req.params.id + " " + JSON.stringify(req.body));
	chessModule[req.params.id](req.body, res);
});


app.post('/domain/:id', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log(req.params.id + " " + JSON.stringify(req.body));
	//console.log(domainModule);
	domainModule[req.params.id](req.body, res);
});

app.post('/quizQuestion/:id', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log(req.params.id + " " + JSON.stringify(req.body));
	//console.log(domainModule);
	quizQuestionsModule[req.params.id](req.body, res);
});


app.post('/execute/:id', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				console.log(req.params.id + " " + JSON.stringify(req.body));
				security[req.params.id](req.body, res);
			}
		});
	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

function createThumbnail(a,imgdir, callback) {
	console.log(a);
	lwip.open(a.fPath, function(err, image) {
		image.resize(200, 200, function(err) {
			if (err) throw err;
			image.writeFile(imgdir + a.name, function(err) {
				if (err) throw err;
			});
		})
	});

	callback();
}

function thumbnail(i, arr,imgdir) {
	if (i < arr.length) {
		createThumbnail(arr[i],imgdir,
			function() {
				thumbnail(i + 1, arr,imgdir)
			});
	};
}

app.post('/photo', function(req, res) {
	console.log(req.body);

	var arr;
	var fstream;
	var filesize = 0;
	req.pipe(req.busboy);

	var paths = [];
	var saveTo = "";
	var name = "";
	
	var fields = {};

	 req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      fields[fieldname] = val;
    });

	//--------------------------------------------------------------------------
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

		//uploaded file name, encoding, MIME type
		//console.log('File [' + fieldname + ']: filename:' + filename + ', encoding:' + encoding + ', MIME type:' + mimetype);

		name = uuid.v4();
		name += path.extname(filename);
		saveTo = path.join("img/", name);
		
		var imgInfo = {
			fPath: saveTo,
			name: name,
			fName : filename
		};

		file.pipe(fs.createWriteStream(saveTo));

		paths.push(imgInfo);

	}); //	@END/ .req.busboy

	req.busboy.on('finish', function() {

		//console.log(paths);
		
		thumbnail(0, paths,fields["imgdir"]);
		
		var bodyData = JSON.parse(fields["data"]);
		bodyData.paths = paths;
		bodyData.imgdir = fields["imgdir"];

		quizQuestionsModule["add"](bodyData,res);

		// res.writeHead(200, {
		// 	'Connection': 'close'
		// });
		// res.end("That's all folks!");

	}); //	@END/ .req.busboy
});




server.listen(app.get('port'), app.get('ipaddr'), function() {
	console.log('Express server listening on IP/hostname: "' + app.get('ipaddr') + '" and port: "' + app.get('port') + '"');
});