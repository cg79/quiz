//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)



module.exports = function(swig) {

    var models = {
        render: function(templatePath, obj) {
            console.log("ok");

            var htmlResult = swig.renderFile(templatePath, obj);
            
            return htmlResult;

        }
    };
    return models;
}