//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)



module.exports = function(mongoQuery, encryption) {

    var models = {
        get: function(obj, res) {
            var query = mongoQuery.domainSchemas.Domains.find({
                'level': 0
            });

            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    console.log(recordset.length);
                    if (recordset.length == 0) {
                        var domain = {
                            country: 1, //romania
                            name: "Matematica",
                            level: 0,
                            isPublic: true,
                            game: 1 //quiz
                        };
                        models.add(domain, null);
                    }
                    if (recordset.length > 0) {
                        console.log(recordset);

                        return mongoQuery.result(true, "name", recordset, res);
                    }
                    return mongoQuery.result(false, "Invalid name or password", null, res);
                });
        },
        getup: function(obj, res) {
            console.log("getup");
            console.log(obj);
            var newLevel = obj.level;
            if (newLevel < 0) {
                newLevel = 0;
            }
            var query = mongoQuery.domainSchemas.Domains.find({
                'level': newLevel
            });
            var rez = {
                parent: null,
                items: []
            };

            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    console.log(recordset.length);
                    if (recordset.length > 0) {
                        console.log("a1");
                        console.log(recordset);

                        rez.items = recordset;

                        if (recordset[0].parentGuid != undefined) {
                            query = mongoQuery.domainSchemas.Domains.find({
                                'guid': recordset[0].parentGuid
                            });
                            mongoQuery.executeQuery(query)
                            .then(function(parentResult) {
                                console.log(parentResult);
                                rez.parent = parentResult[0];

                                return mongoQuery.result(true, "name", rez, res);
                            })
                        } else {
                            query = mongoQuery.domainSchemas.Domains.find({
                                'level': 0
                            });
                            mongoQuery.executeQuery(query)
                            .then(function(parentResult) {
                                console.log(parentResult);
                                rez.parent = null;

                                return mongoQuery.result(true, "name", rez, res);
                            })
                        }

                        
                    } else {
                        return mongoQuery.result(true, "Invalid name or password", rez, res);
                    }

                });
        },
        getdown: function(obj, res) {
            var query = null;

            console.log(obj);

            if (obj.level == undefined) {
                query = mongoQuery.domainSchemas.Domains.find({
                    'level': 0
                });
            } else {
                query = mongoQuery.domainSchemas.Domains.find({
                    'parentGuid': obj.guid
                });

            }

            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    if (recordset.length > 0) {
                        console.log(recordset);

                        return mongoQuery.result(true, "name", recordset, res);
                    }
                    return mongoQuery.result(true, "Invalid name or password", [], res);
                });
        },
        add: function(obj, res) {
            try {
                var dbDomain = new mongoQuery.domainSchemas.Domains({
                    name: obj.name,
                    level: obj.level,
                    isPublic: obj.isPublic,
                    guid: encryption.guid(),
                    parentGuid: obj.parentGuid
                });

                console.log("add domain");
                dbDomain.save(function(err) {
                    if (err) throw err;
                    console.log('dbDomain saved successfully!');

                    if (res != null) {
                        return mongoQuery.result(true, "Invalid name or password", dbDomain, res);
                    }

                });
            } catch (e) {
                console.log(e);
            }
        }


    };
    return models;
}