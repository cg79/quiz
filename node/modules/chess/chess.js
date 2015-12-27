//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)
//https://www.npmjs.com/package/chess.js


module.exports = function(mongoQuery, encryption, fs,Chess) {

    var models = {
        dir: "modules/chess/openings/data/",
        inport: function(obj, res) {

            fs.readdir(this.dir, function(err, files) {
                if (err) throw err;
                var c = 0;
                files.forEach(function(file) {
                    c++;
                    //console.log(file);
                    fs.readFile(models.dir + file, 'utf-8', function(err, html) {
                        if (err) throw err;
                        console.log(file);
                        //console.log(mongoQuery);
                        var obj = JSON.parse(html);
                        for (var i = 0; i < obj.result.openings.length; i++) {
                            console.log(obj.result.openings[i].name);

                            var chess = new Chess();
                            chess.load_pgn(obj.result.openings[i].moves_san.join('\n'));

                            var dbOpening = new mongoQuery.openingsSchemas.Openings({
                                name: obj.result.openings[i].name,
                                moves: obj.result.openings[i].moves_san,
                                player_wins: obj.result.openings[i].player_wins,
                                draws: obj.result.openings[i].draws,
                                opponent_wins: obj.result.openings[i].opponent_wins,
                                mas: obj.result.openings[i].moves_san.join(),
                                nodeLength: obj.result.openings[i].moves_san.length,
                                fen:chess.fen()
                            });
                            dbOpening.save(function(err) {
                                if (err) throw err;
                                console.log('dbOpening saved successfully!');
                            });
                        }

                    });
                });
            });

            return mongoQuery.result(false, "Invalid name or password", null, res);
        },
        createOpeningsTree: function(obj, res) {
            //read all openings from the database


            function saveOpeningToDB(dbObj, callback) {
                dbObj.save(function(err) {
                    if (err) throw err;
                    console.log('dbOpening saved successfully!');

                    callback();
                });
            }


            function crateDBOpenings(i, workingRecords, callback) {
                if (i < workingRecords.length) {

                    var wr = workingRecords[i];
                    var dbOpening = new mongoQuery.openingsSchemas.OpeningsTree({
                        name: wr.name,
                        moves: wr.moves_san,
                        player_wins: wr.player_wins,
                        draws: wr.draws,
                        opponent_wins: wr.opponent_wins,
                        mas: wr.mas,
                        nodeLength: wr.nodeLength
                    });

                    saveOpeningToDB(dbOpening,
                        function() {
                            crateDBOpenings(i + 1, workingRecords)
                        });
                } else {

                    console.log("now really done");
                    callback();
                }

                 // for (var i = 0; i < workingRecords.length; i++) {
                    //     var wr = workingRecords[i];
                    //     var dbOpening = new mongoQuery.openingsSchemas.OpeningsTree({
                    //         name: wr.name,
                    //         moves: wr.moves_san,
                    //         player_wins: wr.player_wins,
                    //         draws: wr.draws,
                    //         opponent_wins: wr.opponent_wins,
                    //         mas: wr.mas,
                    //         nodeLength: wr.nodeLength
                    //     });
                    //     dbOpening.save(function(err) {
                    //         if (err) throw err;
                    //         console.log('dbOpening saved successfully!');
                    //     });
                    // }
            };


            function fillChildOpeningNodes(nodeLength, recordset, callback) {
                var workingRecords = _.filter(recordset, function(num) {
                    return num.nodeLength == nodeLength;
                });

                while (workingRecords.length != 0) {
                    nodeLength++;
                    console.log(nodeLength);
                    workingRecords = _.filter(recordset, function(num) {
                        return num.nodeLength == nodeLength;
                    });

                    for (var i = 0; i < workingRecords.length; i++) {
                        var wr = workingRecords[i];
                        var wrArray = [];
                        for (var j = 0; j < wr.moves.length - 1; j++) {
                            wrArray.push(wr.moves[j]);
                        }
                        console.log(wrArray);
                        var nodeQuery = mongoQuery.openingsSchemas.Openings.find({
                            mas: wrArray.join()
                        });

                        mongoQuery.executeQuery(nodeQuery)
                            .then(function(nodes) {
                                console.log(nodes.length);
                            });

                    }
                }
            };



            var nodeLength = 0;
            var query = mongoQuery.openingsSchemas.Openings.find({


            });


            mongoQuery.executeQuery(query)
                .then(function(recordset) {
                    nodeLength++;
                    console.log(nodeLength);
                    var workingRecords = _.filter(recordset, function(num) {
                        return num.nodeLength == nodeLength;
                    });

                    if (workingRecords == []) {
                        return mongoQuery.result(false, "Invalid name or password", null, res);
                    }


                   

                    crateDBOpenings(0, workingRecords);

                    
                    fillChildOpeningNodes(2,recordset,null);


                });


            return mongoQuery.result(false, "Invalid name or password", null, res);
        }

    };
    return models;
}