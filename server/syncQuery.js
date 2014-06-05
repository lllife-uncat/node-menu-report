/**
* Query database with mongo-sync module.
*/
function SyncQuery() {
  /**
  * Load modules.
  */
  var setting = require("./setting");
  var databaseUri = setting.databaseUri;
  var databaseName = setting.databaseName;
  var mongoSync = require("mongo-sync");
  var Server = mongoSync.Server;
  var mongo = new Server(databaseUri);
  var db = mongo.db(databaseName);
  var self = this;
  var _ = require("lodash");

  this.ObjectId = mongoSync.ObjectId;

  /**
  * Function findByExample().
  * @param {String} entity - Collection name.
  * @param {Object} example - Query condition.
  * @return {Array} - Query results.
  * @api {Public}.
  */
  this.findByExample = function(entity, example, fields) {
    fields = fields || {};
    var c = db.getCollection(entity);
    //var rs = c.find(example).toArray();
    var rs = c.find(example, fields);

    var datas = [];

    var range = _.range(0, rs.count());
    range.forEach(function(r){
      var data = rs.next();
      datas.push(data);
    });

    return datas;

  };

  /**
  * Function findPIRByExample().
  * @param {Object} example - Query condition.
  * @return {Array} - List of pir info.
  */
  this.findPIRByExample = function(example){
    return self.findByExample(example);
  };

  /**
  * Function findTouchByExample()
  * @param {Object} example - Query condition.
  * @return {Array} - List of touch info.
  */
  this.findTouchByExample = function(example, fields){
    return self.findByExample("MenuTouchInfo", example, fields);
  };

  /**
  * Function findAllBranch().
  * @return {Array} - All branchs in database.
  * @api {Public}
  */
  this.findAllBranch = function(example) {
    return self.findByExample("MenuBranchInfo", example || {});
  };

  /**
  * Function findAllDevice().
  * @return {Array} - All devices in databases.
  * @api {Public}
  */
  this.findAllDevice = function(example) {
    return self.findByExample("MenuDeviceInfo", example || {});
  };
}

/**
* Export all public api here.
*/
module.exports.SyncQuery = SyncQuery;
