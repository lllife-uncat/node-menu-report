/**
* Load application setting and init database instance.
*/
var setting = require("./setting");
var mongojs = require("mongojs");
var db = mongojs(setting.connectionString);
var query = require("./query")(db);
var fiber = require("fibers");
var touchs = require("./touchs");
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
  * Return touch001 report.
  */
  app.post("/report/touch001", function(req, res){
    fiber(function(){
      var body = req.body;
      var touch = new touchs.Touch001(body);
      var rs = touch.startQuery();
      res.json(rs);
    }).run();
  });

  /**
  * Return all branchs in database.
  */
  app.get("/api/branch", function(req, res){
     query.findAllBranch(function(err, docs){
       res.json(docs);
     });
  });

  /**
  * Return all devices in database.
  */
  app.get("/api/device", function(req, res){
    query.findAllDevice(function(err, docs){
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
