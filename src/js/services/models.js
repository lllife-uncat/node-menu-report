app.factory("models", function(collections, globalService){

  /**
  * Function parseQuery().
  * @param {Object} data - Query condition from input form.
  * @return {Object} - New query object.
  * @api {Public}
  */
  function parseQuery(data) {
    var reportType = data.reportType;

    // Create query object.
    var query = {};
    query.reportType= reportType;
    query.timeFrom= data.timeFrom.key;
    query.timeTo= data.timeTo.key;

    if(reportType === "Daily") {
      // Daily conditions.
      query.dailyMonth= data.dailyMonth.key;
      query.dailyYear= data.dailyYear.key;
    }else if(reportType == "Monthly") {
      // Monthly conditions.
      query.monthlyFrom= data.monthlyFrom.key;
      query.monthlyTo= data.monthlyTo.key;
    }else {
      // Yearly conditions.
      query.yearlyFrom= data.yearlyFrom.key;
      query.yearlyTo= data.yearlyTo.key;
    }

    // Addition conditions.
    // If 0 will not include as query condition.
    query.branch= data.branch._id || 0;
    query.device= data.device._id || 0;
    query.categoryA = data.categoryA._id || 0;
    query.categoryB = data.categoryB._id || 0;
    query.categoryC = data.categoryC._id || 0;
    query.product = data.product._id || 0;

    // Show in browser console.
    console.log("::query");
    console.log(query);

    return query;
  }

  /**
  * Class TouchCondition.
  * Keep all query conditions and dropdown options.
  * @api {Public}
  */
  function TouchCondition(init) {
    init = init || {};

    // Daily conditions.
    this.dailyMonth = init.dailyMonth;
    this.dailyYear = init.dailyYear;

    // Monthly conditions.
    this.monthlyFrom = init.monthlyFrom;
    this.monthlyTo = init.monthlyTo;

    // Yearly conditions.
    this.yearlyFrom = init.yearlyFrom;
    this.yearlyTo = init.yearlyTo;

    // All play all 'Dialy' 'Monthly' and 'Yearly'.
    this.timeFrom = init.timeFrom;
    this.timeTo = init.timeTo;

    // Report type 'Daily' 'Monthly' and 'Yearly'.
    this.reportType =  init.reportType;

    // List of avialabel dropdown condition.
    // Can dynamic render up to user behavior.
    this.branchs = [];
    this.devices = [];
    this.devicesInBranch = [];
    this.months = collections.monthList;
    this.years = collections.yearList;
    this.times = collections.getTimeList();
    this.products = [];

    // Addition conditions can apply to all type of report.
    this.categoriesA = [];
    this.categoriesB = [];
    this.categoriesB = [];
    this.categoryA = {};
    this.categoryB = {};
    this.categoryC = {};
    this.product = {};
  }

  /**
  * Return public api.
  */
  return {
    TouchCondition: TouchCondition,
    parseQuery: parseQuery
  };

});
