var setting = require("../server/setting");
var nodejs = require("mongojs");
var db = nodejs(setting.connectionString);
var query = require("../server/query")(db);

exports.testQueryProduct = function(test) {

  query.findAllProductByExample({}, function(err, docs){
    test.equal(err, null);
    test.notEqual(docs, null);
    test.notEqual(docs.length, 0, "Result more than zero.");
    test.done();
  });

}
