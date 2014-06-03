/**
* Load dependencies.
* @module syncQuery - Generic syncronouse query function.
* @module fiber - Multitask library.
*/
var sync = require("../syncQuery");
var fiber = require("fibers");


/**
* Class Touch001 - Manage query for "touch001" report.
*/
function Touch001(cons) {

  /**
  * Keey class reference on self variable.
  */
  var self = this;

  /**
  * Function queryYearlyReport().
  * @return {Array} - Touchs information.
  * @api {Private}
  */
  this.queryYearlyReport = function() {
    var from = cons.yearlyFrom;
    var to = cons.yearlyTo;
    var timeFrom = cons.timeFrom;
    var timeTo = cons.timeTo;
    var example = {
      $and: [
        { hour: { $gte: timeFrom} },
        { hour: { $lte: timeTo } },
        { year: { $gte: from }},
        { year: { $lte: from }}
      ]
    };

    var q = new sync.SyncQuery();
    var touchs = q.findByExample("MenuTouchInfo", example);
    return touchs;
  };

  /**
  * Function queryMonthlyReport().
  * @return {Array} - Touchs information.
  * @api {Private}
  */
  this.queryMonthlyReport = function() {
    var from = cons.monthlyFrom;
    var to = cons.montlyTo;
    var timeFrom = cons.timeFrom;
    var timeTo = cons.timeTo;
    var example = {
      $and: [
        { hour: { $gte: timeFrom} },
        { hour: { $lte: timeTo } },
        { month: { $gte: from} },
        { month: { $lte: to} } },
      ]
    };

    var q = new sync.SyncQuery();
    var touchs = q.findByExample("MenuTouchInfo", example);
    return touchs;
  };

  /**
  * Function queryDailyReport().
  * @return {Array} - Touchs informations.
  */
  this.queryDailyReport = function() {
    var month = cons.dailyMonth;
    var year = cons.dailyYear;
    var timeFrom = cons.timeFrom;
    var timeTo = cons.timeTo;
    var branch = cons.branch;
    var device = cons.device;

    var example = {
      $and: [
        { hour: { $gte: timeFrom} },
        { hour: { $lte: timeTo } },
        { year: year },
        { month: month }
      ]
    };

    var q = new sync.SyncQuery();
    var touchs = q.findByExample("MenuTouchInfo", example);
    return touchs;
  }

  /**
  * Function startQuery().
  * Query touch information up to query type.
  * Query type can be "Daily", "Monthly" and "Yearly".
  * @return {Array} - Touchs information.
  * @api {Public}
  */
  this.startQuery = function() {
    if(cons.reportType === "Daily") {
      var rs = self.queryDaliyReport();
      return rs;
    }
  }
}

/**
* Export all public function here.
*/
module.exports.Touch001 = Touch001;
