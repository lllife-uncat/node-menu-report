/**
* Query database with mongo-sync module.
*/
function SyncQuery() {

  /**
  * Load modules.
  */
  var setting = require("./setting");
  var connectionString = setting.connectionString;
  var Server = require("mongo-sync").Server;
  var mongo = new Server("localhost:27017");
  var db = mongo.db("NewEMenuSystems");
  var self = this;

  /**
  * Function findByExample().
  * @param {String} entity - Collection name.
  * @param {Object} example - Query condition.
  * @return {Array} - Query results.
  * @api {Public}.
  */
  this.findByExample = function(entity, example) {
    var c = db.getCollection(entity);
    var rs = c.find(example).toArray();
    return rs;
  };

  /**
  * Function findAllBranch().
  * @return {Array} - All branchs in database.
  * @api {Public}
  */
  this.findAllBranch = function() {
    var collection = db.getCollection("MenuBranchInfo");
    var branchs = collection.find().toArray();
    return branchs;
  };

  /**
  * Function findAllDevice().
  * @return {Array} - All devices in databases.
  * @api {Public}
  */
  this.findAllDevice = function() {
    var collection = db.getCollection("MenuDeviceInfo");
    var devices = collection.find().toArray();
    return devices;
  };
}

/**
* Export all public api here.
*/
module.exports.SyncQuery = SyncQuery;
