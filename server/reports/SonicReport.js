/**
* Class sonic report.
* Constructor.
* @param {object} db, mongo database object.
* @member {object} db
*/
var SonicReport = function(db) {

  /**
  * @member {Object} db.
  */
  this.db = db;

  /**
  * Function getCollection
  * @param {String} name, collection name.
  * @return {Object} collecton.
  */
  this.getCollection = function(name) {
    return this.db.getCollection(name);
  };

  /**
  * Function process.
  * @param {Object} req
  * @param {Object} res
  */
  this.process = function(req, res) {
    res.end("Hello");
  };
};

/**
* Export SonicReport to caller.
*/
module.exports = SonicReport;
