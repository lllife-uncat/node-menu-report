/**
* Load application setting and init database instance.
*/
var setting = require("./setting");
var mongojs = require("mongojs");
var db = mongojs(setting.connectionString);
var query = require("./query")(db);

/**
* Load report processing module.
*/
var SR = new require("./reports/SonicReport");
var sonic = new SR(db);

/**
* Init node route.
* @param {object} app, an expressjs instance.
*/
function init(app) {

  /**
  * Return index.html
  */
  app.get("/", function(req, res){
    res.sendfile("/dev/index.html");
  });

  /**
  * Return sonic report.
  */
  app.get("/report/sonic", sonic.process);

  /**
  * Return all branchs in database.
  */
  app.get("/api/branch", function(req, res){
     query.findAllBranch(function(err, docs){
       res.json(docs);
     });
  });
}


/**
* Export only init function.
*/
module.exports = {
  init: init
};
