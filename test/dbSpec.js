var expect = require("chai").expect;
var sync = require("../server/syncQuery");
var fiber = require("fibers");

describe.skip("[SyncQuery]", function(){

  it("Should query devices by example sucessful", function(done){
    fiber(function(){
      var q = new sync.SyncQuery();
      var rs = q.findByExample("MenuDeviceInfo", { deviceId: "Big Screen 001"});
      expect(rs.length).to.not.equal(0);
      expect(rs[0].deviceId).to.equal("Big Screen 001");
      done();
    }).run();
  });

  it("Should query branchs and devices sucessful.", function(done){
    fiber(function(){
      var q = new sync.SyncQuery();
      var branchs = q.findAllBranch();
      var devices = q.findAllDevice();
      expect(branchs.length).to.not.equal(0);
      expect(devices.length).to.not.equal(0);
      done();
    }).run();
  });

  it("Should query branch successful.", function(done){
    fiber(function(){
      var q = new sync.SyncQuery();
      var branchs = q.findAllBranch();
      expect(branchs).to.not.equal(null);
      expect(branchs.length).to.not.equal(0);
      done();
    }).run();
  });


  it("Should query devices successful.", function(done){
    fiber(function(){
      var q = new sync.SyncQuery();
      var devices = q.findAllDevice();
      expect(devices.length).to.not.equal(0);
      done();
    }).run();
  });

});
