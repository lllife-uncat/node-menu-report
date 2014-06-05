app.factory("models", function(collections, globalService){

  /**
  * Function parseQuery().
  * @param {Object} data - Query condition from input form.
  * @return {Object} - New query object.
  */
  function parseQuery(data) {
    var reportType = data.reportType;
    var query = {};
    query.reportType= reportType;
    query.timeFrom= data.timeFrom.key;
    query.timeTo= data.timeTo.key;

    if(reportType === "Daily") {
      query.dailyMonth= data.dailyMonth.key;
      query.dailyYear= data.dailyYear.key;
    }else if(reportType == "Monthly") {
      query.monthlyFrom= data.monthlyFrom.key;
      query.monthlyTo= data.monthlyTo.key;
    }else {
      query.yearlyFrom= data.yearlyFrom.key;
      query.yearlyTo= data.yearlyTo.key;
    }

    query.branch= data.branch._id;
    query.device= data.device._id;
    query.categoryA = data.categoryA._id;
    query.categoryB = data.categoryB._id;
    query.categoryC = data.categoryC._id;
    query.product = data.product._id;

    return query;
  }

  function TouchCondition(init) {
    init = init || {};

    this.dailyMonth = init.dailyMonth;
    this.dailyYear = init.dailyYear;
    this.monthlyFrom = init.monthlyFrom;
    this.monthlyTo = init.monthlyTo;
    this.yearlyFrom = init.yearlyFrom;
    this.yearlyTo = init.yearlyTo;
    this.timeFrom = init.timeFrom;
    this.timeTo = init.timeTo;

    this.reportType =  init.reportType;

    this.branchs = [];
    this.devices = [];
    this.devicesInBranch = [];
    this.months = collections.monthList;
    this.years = collections.yearList;
    this.times = collections.getTimeList();

    this.products = [];
    this.categoriesA = [];
    this.categoriesB = [];
    this.categoriesB = [];

    this.categoryA = {};
    this.categoryB = {};
    this.categoryC = {};
    this.product = {};
  }

  return {
    TouchCondition: TouchCondition,
    parseQuery: parseQuery
  };

});
