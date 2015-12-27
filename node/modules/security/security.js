//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)

// var mongo = require('mongodb');
// var mongoose = require("mongoose");
// var schemas = require('./../../models/models.js')(mongoose);
// mongoose.connect('mongodb://localhost/myappdatabase');


// var Server = mongo.Server,
//     Db = mongo.Db,
//     BSON = mongo.BSONPure;

// var server = new Server('localhost', 27017, {
//     auto_reconnect: true
// });
// db = new Db('sq', server, {
//     safe: true
// });


module.exports = function(mongoQuery,encryption,jwt,email) {
    var models = {
        
        CreateUserResponse:function(obj,token)
        {
            var result = {
                name:obj.name,
                email:obj.email,
                firstName:obj.firstName,
                lastName:obj.lastName,
                token:token,
                userInfo:{

                }
            };    
            return result;
        },
        Logout:function(obj,res) {
            console.log(mongoQuery);
             mongoQuery.result(false, "Invalid name or password", null, res);
        },
        Login: function(obj,res) {
            console.log(mongoQuery);

            var query = mongoQuery.userSchemas.Users.find({
                $or: [{
                    'name': obj.Login
                }, {
                    'email': obj.Login
                }]
            });

            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    if (recordset.length > 0) {
                        console.log(recordset);
                        var user = recordset[0];
                        var password = encryption.encrypt(obj.Password,recordset[0].salt);

                        console.log(password + " -- " +user.password);
                        if(password != user.password )
                        {
                            return mongoQuery.result(false, "Invalid  password", null, res);        
                        }
                         var token = jwt.sign(user, "ilovescotchyscotch", {
                                       expiresInMinutes: 1440 // expires in 24 hours
                                     });
                        var user = models.CreateUserResponse(user,token);
                        return mongoQuery.result(true, "name", user, res);
                    }
                    return mongoQuery.result(false, "Invalid name or password", null, res);
                });

        },
        CreateUser: function(obj, res) {

            var query = mongoQuery.userSchemas.Users.find({
                $or: [{
                    'name': obj.Login
                }, {
                    'email': obj.Email
                }]
            });

            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    if (recordset.length > 0) {
                        if(recordset[0].name == obj.Login)
                        {
                             return mongoQuery.result(false, "name", null, res);   
                        }else{
                             return mongoQuery.result(false, "email", null, res);   
                        }
                    }
                    var salt = encryption.salt();
                    var encryptedPassword = encryption.encrypt(obj.Password,salt);

                    var dbUser = new mongoQuery.userSchemas.Users({
                        name: obj.Login,
                        email: obj.Email,
                        password: encryptedPassword,
                        salt:salt,
                        guid:encryption.guid()
                    });

                    dbUser.save(function(err) {
                        if (err) throw err;
                        console.log('User saved successfully!');

                        email.emailCreateUser(obj,obj.Email);

                        return models.Login({
                            Login:obj.Login,
                            Password:obj.Password
                        },res);   
                    });

                });
        },
        CreateUser1: function(obj, res) {

            var query = mongoQuery.userSchemas.Users.find({
                name: obj.Login
            });

            models.executeQuery(query)
                .then(function(recordset) {
                    console.log("intra");
                    console.log(recordset);
                    if (recordset.length > 0) {
                        console.log("1");
                        return models.result(false, "name", null, res);
                    }
                    query = mongoQuery.userSchemas.Users.find({
                        email: obj.Email
                    });
                    models.executeQuery(query)
                        .then(function(recordset) {
                            if (recordset.length > 0) {
                                return models.result(false, "email", null, res);
                            }

                            var salt = encryption.salt();
                            var encryptedPassword = encryption.encrypt(obj.Password);

                            var dbUser = new mongoQuery.userSchemas.Users({
                                name: obj.Login,
                                email: obj.Email,
                                password: encryptedPassword
                            });

                            dbUser.save(function(err) {
                                if (err) throw err;
                                console.log('User saved successfully!');
                            });


                        });
                });
        }
    };
    return models;
}