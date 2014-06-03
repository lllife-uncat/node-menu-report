app.factory("models", function(collections, globalService){

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
  }

  return {
    TouchCondition: TouchCondition
  };

});
