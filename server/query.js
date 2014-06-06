/**
* Import node modules.
*/
var util = require("util");

/**
* Class Query, manage all databse query.
*/
function Query(db) {

  var self = this;

  /**
  * Log full object tree.
  * @param {Object} obj
  */
  this.log = function(obj){
    var u = util.inspect(obj, { showHidden: false, depth: null});
    console.log(u);
  };

  /**
  * Function save().
  * @param {String} entity - Collection name.
  * @param {Object} obj - Data object.
  * @param {Function} callback - Callback function.
  * @api {Public}
  */
  this.save = function(entity, obj, callback){
    var collection = db.collection(entity);
    collection.save(obj, function(err, obj){
      callback(err, obj);
    });
  };

  /**
  * Function findAll()
  * Find all document by example.
  * @param {String} entity: collection name.
  * @param {Object} example: query condition.
  * @param {Function} callback: query callback.
  * @api {private}
  */
  this.findAll = function(entity, example, callback) {

    example.delete = false;
    example.archive = false;

    this.log(entity);
    this.log(example);

    var collection = db.collection(entity);
    collection.find(example, function(err, documents){

      /**
      * Delete private server properties.
      */
      documents.forEach(function(doc){
        delete(doc.className);
        delete(doc.delete);
        delete(doc.archive);
      });
      callback(err, documents);
    });
  };

  /**
  * Function findAllProductByExample().
  * @param {Object} example - Query condition.
  * @param {Function} callback - Query callback function.;
  * @api {Public}
  */
  this.findAllProductByExample = function(example, callback){
    var coll = "MenuProductInfo";
    if(typeof(example) === "function"){
      self.findAll(coll, {}, example);
    }else {
      self.findAll(coll, example, callback)
    }
  };

  /**
  * Function findAllCategoryByExample().
  * @param {Object} example - Query conditions.
  * @param {Function} callback - Query callback.
  * @api {Public}
  */
  this.findAllCategoryByExample = function(example, callback){
    var coll = "MenuCategoryInfo";
    if(typeof(example) === "function") {
      self.findAll(coll, {}, example);
    }else {
      self.findAll(coll, example, callback);
    }
  };

  /**
  * Function findAllTouchByExample().
  * @param {Object} example - Query condition.
  * @param {Function} callback - Query callback function.
  * @api {Public}
  */
  this.findAllTouchByExample = function(example, callback) {
    self.findAll("MenuTouchInfo", example, callback);
  };

  /**
  * Function findAllDevice().
  * Find all devices in db.
  * @param {Function} callback.
  * @api {Public}
  */
  this.findAllDevice = function(callback){
    self.findAll("MenuDeviceInfo", {}, callback);
  };

  /**
  * Function findAllBranch().
  * Find all branch in db.
  * @param {Function} callback.
  * @api {Public}
  */
  this.findAllBranch = function(callback) {
    self.findAll("MenuBranchInfo", {}, callback);
  };

  /**
  * Function getCollection().
  * Get collection by name.
  * @param {String} name - A collection name in mongo.
  * @return {Object} - Mongo collection.
  */
  this.getCollection = function(name) {
    return db.collection(name);
  }

  /**
  * Function save()
  * @param {String} collection - Collection name.
  * @param {Object} object - Data to save into database.
  * @param {Function} callback - Saving callback function.
  * @api {Public}
  */
  this.save = function(collection, object, callback) {
    var coll = db.collection(collection);
    coll.save(object, callback);
  }
}

/**
* Export all public function here.
*/
module.exports = function(db) {
  if(db) {
    return new Query(db);
  }else {
    var connectionString = require("./setting").connectionString;
    var mongojs = require("mongojs");
    var db = mongojs(connectionString);
    return new Query(db);
  }
};
