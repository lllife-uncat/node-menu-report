/**
* Load application setting and init database instance.
*/
var setting = require("./setting");
var mongojs = require("mongojs");
var db = mongojs(setting.connectionString);

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

  app.get("/", function(req, res){
    res.sendfile("/dev/index.html");
  });

  app.get("/report/sonic", sonic.process);
}

/**
* Export only init function.
*/
module.exports = {
  init: init
};
