/**
* Load dependencies.
* @module syncQuery - Generic syncron$ouse query function.
* @module fiber - Multitask library.
*/
var sync = require("../syncQuery");
var fiber = require("fibers");
var util = require("util");
var _ = require("lodash");

/**
* Class Touch001 - Manage query for "touch001" report.
*/
function Touch001(cons) {

  /**
  * White query conditions to console.
  */
  console.log(cons);

  /**
  * Keep class reference on 'self' variable.
  */
  var self = this;

  /**
  * Function appendTimeCondition().
  * @param {Array} $and - And ($and) condition.
  * @api {Private}
  */
  this.appendTimeCondition = function($and) {
    $and.push({ hour: { $gte: cons.timeFrom }});
    $and.push({ hour: { $lte: cons.timeTo }});
  };

  /**
  * Function append branch and device into query condition.
  * @param {Array} $and - And condition.
  * @api {Private}
  */
  this.appendBranchAndDeviceCondition = function($and) {
    if(cons.branch) {

      // Create query object
      var q = new sync.SyncQuery();
      var ObjectId = q.ObjectId;

      // Find branch in database.
      var branch = q.findAllBranch({ _id: new ObjectId(cons.branch)} )[0];

      // Find all devices in branch.
      var devsInBranch = [];
      branch.deviceIds.forEach(function(id){
        var dev = q.findAllDevice({ _id: new ObjectId(id)} )[0];
        devsInBranch.push(dev);
      });

      // Create device condition.
      if(cons.device) {

        // Find specific device serial number.
        var dev = _.filter(devsInBranch, function(x) { return x._id.toString() === cons.device })[0];
        $and.push(  { deviceId: dev.serialNumber } );

      } else {
        // List all devices serial number.
        //self.log(devsInBranch);
        var allSerials = _.flatten(devsInBranch, "serialNumber");

        // Create branch condition.
        $and.push(  { deviceId:  { $in: allSerials } }  );
      }
    }
  };

  /**
  * Function appendCategoryCondition()
  * Append category 'A' 'B' 'C' and Product as query conditions.
  * @param {Object} $and - Pre exist conditions.
  * @api {Private}
  */
  this.appendCategoryCondition = function($and) {
    // Hack

    // Query conditions.
    var categoryA = cons.categoryA;
    var categoryB = cons.categoryB;
    var categoryC = cons.categoryC;
    var product = cons.product;

    // Query object.
    var q = new sync.SyncQuery();
    var ObjectId = q.ObjectId;

    if(categoryA) {

      // Find all top level category.
      var cbs = q.findAllCategory({ parentId: categoryA });
      var cbIds = _.map(cbs, function(x) { return x._id.toString() });

      // Find all child level.
      var ccs = q.findAllCategory( { parentId: { $in: cbIds } } );
      var ccIds = _.map(ccs, function(x) { return x._id.toString() });

      // Find all product under child level.
      var pros = q.findAllProduct({
        categoryIds: { $in: ccIds }
      });
      var proIds = _.map(pros, function(x) { return x._id.toString() });

      // Find all touch touch match products.
      $and.push({
        objectId: { $in: proIds }
      });
    }
  };

  /**
  * Function queryYearlyReport().
  * @return {Array} - Touchs information.
  * @api {Private}
  */
  this.queryYearlyReport = function() {
    var from = cons.yearlyFrom;
    var to = cons.yearlyTo;
    var example = {
      $and: [
        { year: { $gte: from }},
        { year: { $lte: to}}
      ]
    };

    // Append addtion conditions.
    self.appendTimeCondition(example.$and);
    self.appendBranchAndDeviceCondition(example.$and);
    self.appendCategoryCondition(example.$and);

    var touchs = self.query(example);
    return touchs;
  };

  this.log = function(obj){
    var u = util.inspect(obj, { showHidden: false, depth: null});
    console.log(u);
  };

  /**
  * Function query().
  * @param {Object} example - Query condition.
  * @return {Array} - Touch infos.
  */
  this.query = function(example) {
    self.log(example);

    var ignore = {
      _id:0,
      touchDate: 0,
      collectionDate: 0,
      createDate:0,
      lastUpdate:0,
      "delete": 0,
      archive:0,
      collectId: 0,
      className:0,
      second:0,
      minute:0
    };

    var q = new sync.SyncQuery();
    var touchs = q.findTouchByExample(example, ignore);
    return touchs;
  }

  /**
  * Function queryMonthlyReport().
  * @return {Array} - Touchs information.
  * @api {Private}
  */
  this.queryMonthlyReport = function() {
    var from = cons.monthlyFrom;
    var to = cons.monthlyTo;
    var example = {
      $and: [
        { month: { $gte: from} },
        { month: { $lte: to} }
      ]
    };

    // Append addition conditions.
    self.appendTimeCondition(example.$and);
    self.appendBranchAndDeviceCondition(example.$and);
    self.appendCategoryCondition(example.$and);

    var touchs = self.query(example);
    return touchs;
  };

  /**
  * Function queryDailyReport().
  * @return {Array} - Touchs informations.
  */
  this.queryDailyReport = function() {
    var month = cons.dailyMonth;
    var year = cons.dailyYear;
    var branch = cons.branch;
    var device = cons.device;

    var example = {
      $and: [
        { year: year },
        { month: month }
      ]
    };

    // Append addition conditions.
    self.appendTimeCondition(example.$and);
    self.appendBranchAndDeviceCondition(example.$and);
    self.appendCategoryCondition(example.$and);

    var touchs = self.query(example);
    return touchs;
  };

  /**
  * Function queryTouch().
  * Query touch information up to query type.
  * Query type can be "Daily", "Monthly" and "Yearly".
  * @return {Array} - Touchs information.
  * @api {Public}
  */
  this.queryTouch = function() {
    if(cons.reportType === "Daily") {
      return self.queryDailyReport();
    }else if(cons.reportType === "Monthly") {
      return self.queryMonthlyReport();
    }else {
      return self.queryYearlyReport();
    }
  };

  /**
  * Function daysInMonth() - Get number of days in month on specific year.
  * @param {Number} month
  * @param {Number} year
  * @return {Number} - Number of days in month.
  */
  this.daysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
  };

  /**
  * Function createOutputObject().
  * @param {Array} range - Columns info.
  * @param {}
  */
  this.createOutputObject = function(range, groups) {
    var values = [];
    range.forEach(function(d){
      if(groups[d] == null) {
        groups[d] = [];
      }
      values.push(groups[d].length);
    });

    return new Output(range, values, groups);
  }

  /**
  * Function months()
  * @return - List of month names.
  */
  this.months = function() {
    var monthNames = [ "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December" ];
    return monthNames;
  }

  /**
  * Function startQuery().
  * @return {Object} - Query information for create table and group on client.
  * @api {Public}
  */
  this.startQuery = function() {

    var type = cons.reportType;
    var touchs = self.queryTouch();
    touchs.forEach(function(x){
      delete(x.touchDate);
      delete(x.objectType);
      delete(x.collectionDate);
    });

    if(type === "Daily") {
      var days = self.daysInMonth(cons.dailyMonth + 1, cons.dailyYear);
      var groups = _.groupBy(touchs, function(x) { return x.date });

      // Add columns.
      // (0 - Days in month)
      var range = _.range(0, days);
      var rs = self.createOutputObject(range, groups);

      _.range(0, range.length).forEach(function(r){
        rs.columns[r] = range[r] + 1;
      });

      return rs;

    }else if(type === "Monthly") {
      // Month
      var start = cons.monthlyFrom;
      var end = cons.monthlyTo;

      // Range between 0 and 11
      var range = _.range(start, end + 1);
      var groups = _.groupBy(touchs, function(x) { return x.month });
      var rs = self.createOutputObject(range, groups);

      var months = self.months();
      _.range(0, range.length).forEach(function(m){
         rs.columns[m] = months[m];
      });

      return rs;

    }else {
      // Year
      var start = cons.yearlyFrom;
      var end = cons.yearlyTo;
      var range = _.range(start, end + 1);
      var groups = _.groupBy(touchs, function(x){ return x.year });
      var rs = self.createOutputObject(range, groups);
      return rs;
    }
  };
}

/**
* Class Ouput - List of data to render as graph and table on client.
* @member {Array} columns - Graph label.
* @member {Array} values - Graph value.
* @member {Object} datas - Raw data.
* @api {Private}
*/
function Output(columns, values, datas) {
  this.columns = columns || [];
  this.values = values || [];
  this.datas = [];

  var self = this;
  var index = 0;
  for(var key in datas){
    var d = datas[key];
    self.datas.push(d);
  }
}

/**
* Export all public function here.
*/
module.exports.Touch001 = Touch001;
