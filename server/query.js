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
      callback(err, documents);
    });
  }

  /**
  * Function findAllBranch().
  * Find all branch in db.
  * @param {Function} callback.
  * @api {Public}
  */
  this.findAllBranch = function(callback) {
    self.findAll("MenuBranchInfo", {}, callback);
  }
}

/**
* Export all public function here.
*/

module.exports = function(db) {
  return new Query(db);
};
