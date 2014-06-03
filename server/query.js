/**
* Class Query, manage all databse query.
*/
function Query(db) {

  var self = this;

  /**
  * Function findAll()
  * Find all document by example.
  * @param {String} entity: collection name.
  * @param {Object} example: query condition.
  * @param {Function} callback: query callback.
  * @api {private}
  */
  this.findAll = function(entity, example, callback) {
    console.log("find::" + entity);
    console.log("by::" + example);
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
}

/**
* Export all public function here.
*/
module.exports = function(db) {
  return new Query(db);
};
