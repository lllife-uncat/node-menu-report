
var expect = require("chai").expect;
var mongojs = require("mongojs");
var q = require("../server/query")();

describe("[Branch]", function(){

  /**
  * Try to create new branch and append exist devices.
  */
  it("Should insert branch successful.", function(done){

    /**
    * Create new branch.
    */
    var branch = {
      name: "Hello A",
      deviceIds: []
    };

    /**
    * Find devices in database.
    */
    q.findAllDevice(function(err, docs){

      /**
      * Append device id under new branch.
      */
      docs.forEach(function(doc){
        branch.deviceIds.push(doc._id.toString());
      });

      /**
      * Save new branch into database.
      */
      q.save("MenuBranchInfo", branch, function(err, doc){
        if(!err) {
          console.log(doc);
          done();
        }
      });
    });
  });
});
