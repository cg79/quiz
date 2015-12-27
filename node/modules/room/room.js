//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)



module.exports = function(mongoQuery,encryption) {

    var models = {
        navigation: function(obj, res) {
            console.log("ok");

            var query = mongoQuery.schemas.Rooms.find({
                'level': 0
            });

            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    console.log(recordset.length);
                    if (recordset.length == 0) {
                        var room = {
                            country : 1,//romania
                            name:"Matematica",
                            level:0,
                            isPublic:true,
                            game:1//quiz
                        };
                        models.addRoom(room, null);
                    }
                    if (recordset.length > 0) {
                        console.log(recordset);

                        return mongoQuery.result(true, "name", recordset, res);
                    }
                    return mongoQuery.result(false, "Invalid name or password", null, res);
                });

        },
        addRoom: function(obj, res) {
            try {
                var dbRoom = new mongoQuery.schemas.Rooms({
                    name: obj.name,
                    level:obj.level,
                    isPublic:obj.isPublic,
                    guid: encryption.guid()
                });
                console.log("add room");
                dbRoom.save(function(err) {
                    if (err) throw err;
                    console.log('Room saved successfully!');

                    if (res != null) {
                       return mongoQuery.result(true, "Invalid name or password", dbRoom, res);
                    }

                });
            } catch (e) {
                console.log(e);
            }

        }
    };
    return models;
}