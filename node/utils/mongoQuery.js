//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)

var mongo = require('mongodb');
var mongoose = require("mongoose");
var userSchemas = require('./../schemas/user.js')(mongoose);
var roomSchemas = require('./../schemas/room.js')(mongoose);
var domainSchemas = require('./../schemas/domain.js')(mongoose);
var quizSchemas = require('./../schemas/quiz.js')(mongoose);

var openingsSchemas = require('./../schemas/chess.js')(mongoose);


mongoose.connect('mongodb://localhost/myappdatabase');


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
    auto_reconnect: true
});
db = new Db('sq', server, {
    safe: true
});


module.exports = function(q) {
    var models = {
        userSchemas:userSchemas,
        roomSchemas:roomSchemas,
        domainSchemas:domainSchemas,
        quizSchemas:quizSchemas,
        openingsSchemas:openingsSchemas,
        executeQuery: function(query) {
            var deferred = q.defer();

            query.exec(function(err, recordset) {
                if (err) throw err;
                deferred.resolve(recordset);
            });
            return deferred.promise;
        },
        result: function(ok, message, obj, res) {
            var response = {
                Success: ok,
                Message: message,
                Data: obj
            };
            console.log("d");
            res.send(response);
        },
    };
    return models;
}