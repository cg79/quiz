module.exports = function() {
    var models = {
        display_form: function(req, res) {
            res.sendHeader(200, {
                "Content-Type": "text/html"
            });
            res.write(
                '<form action="/upload" method="post" enctype="multipart/form-data">' +
                '<input type="file" name="upload-file">' +
                '<input type="submit" value="Upload">' +
                '</form>'
            );
            res.close();
        },
        parse_multipart: function(req) {
            var parser = multipart.parser();

            // Make parser use parsed request headers
            parser.headers = req.headers;

            // Add listeners to request, transfering data to parser

            req.addListener("data", function(chunk) {
                parser.write(chunk);
            });

            req.addListener("end", function() {
                parser.close();
            });

            return parser;
        },
        upload_complete: function() {
            res.sendHeader(200, {
                "Content-Type": "text/plain"
            });
            res.write("Thanks for playing!");
            res.end();
        },
        upload_file: function(req, res) {
            console.log("intra");
            req.setBodyEncoding("binary");
 console.log("intra2");
            // Handle request as multipart
            var stream = models.parse_multipart(req);
 console.log("intra3");
            var fileName = null;
            var fileStream = null;

            // Set handler for a request part received
            stream.onPartBegin = function(part) {
                sys.debug("Started part, name = " + part.name + ", filename = " + part.filename);

                // Construct file name
                fileName = "./uploads/" + stream.part.filename;

                // Construct stream used to write to file
                fileStream = fs.createWriteStream(fileName);

                // Add error handler
                fileStream.addListener("error", function(err) {
                    sys.debug("Got error while writing to file '" + fileName + "': ", err);
                });

                // Add drain (all queued data written) handler to resume receiving request data
                fileStream.addListener("drain", function() {
                    req.resume();
                });
            };

            // Set handler for a request part body chunk received
            stream.onData = function(chunk) {
                // Pause receiving request data (until current chunk is written)
                req.pause();

                // Write chunk to file
                // Note that it is important to write in binary mode
                // Otherwise UTF-8 characters are interpreted
                sys.debug("Writing chunk");
                fileStream.write(chunk, "binary");
            };

            // Set handler for request completed
            stream.onEnd = function() {
                // As this is after request completed, all writes should have been queued by now
                // So following callback will be executed after all the data is written out
                fileStream.addListener("drain", function() {
                    // Close file stream
                    fileStream.end();
                    // Handle request completion, as all chunks were already written
                    upload_complete(res);
                });
            };
        }
    };
    return models;
}


