
var expect = require("chai").expect;
var touch001 = require("../server/reports/touch001");
var fiber = require("fibers");

describe("[Touch 001]", function(){
  it("Should query touch 001 report successful", function(done){
    fiber(function(){
      var cons = {
        reportType: "Daily",
        timeFrom: 0,
        timeTo: 24,
        dailyMonth: 10,
        dailyYear: 2014
      };
      var q = new touch001.Touch001(cons);
      var rs = q.startQuery();

      expect(rs).to.not.equal(null);
      expect(rs.length).to.not.equal(0);
      console.log(rs);

      done();
    }).run();;
  });
});

