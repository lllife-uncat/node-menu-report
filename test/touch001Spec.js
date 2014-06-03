
var expect = require("chai").expect;
var touch001 = require("../server/reports/touch001");
var fiber = require("fibers");

describe("[Touch 001]", function(){
  it("Should query touch 001 report successful", function(done){
    fiber(function(){
      var cons = {
        timeFrom: 11,
        timeTo: 12,
        dailyMonth: 2,
        dailyYear: 2014
      };
      var q = new touch001.Touch001(cons);
      var rs = q.queryDailyReport();
      expect(rs).to.not.equal(null);
      expect(rs.length).to.not.equal(0);
      console.log(rs);
      done();
    }).run();;
  });
});

