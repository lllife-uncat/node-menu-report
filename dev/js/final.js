var app = angular.module("menuReport", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "views/home.html",
		controller: "homeController"
	});

  $routeProvider.when("/touch/001", {
    templateUrl: "views/touches/touch001.html",
    controller: "touch001Controller"
  });

  $routeProvider.when("/touch/002", {
    templateUrl: "views/touches/touch002.html",
    controller: "touch002Controller"
  });

  $routeProvider.when("/touch/003", {
    templateUrl: "views/touches/touch003.html",
    controller: "touch003Controller"
  });

  $routeProvider.when("/touch/004", {
    templateUrl: "views/touches/touch004.html",
    controller: "touch004Controller"
  });

  $routeProvider.when("/touch/005",{
    templateUrl: "views/touches/touch005.html",
    controller: "touch005Controller"
  });

  $routeProvider.when("/touch/006",{
    templateUrl: "views/touches/touch006.html",
    controller: "touch006Controller"
  });

	$routeProvider.otherwise({
		redirectTo : "/"
	});

  var x = {
    k: 300,
    n: 500,
    z: 800
  };
});


/**
* Override console object.
*/
(function(window){
  var konsole = window.console;
  window.console = {
    log: function(msg) {
      konsole.log(msg);
    },
    error:function(msg){
      konsole.error(msg);
    }
  };
});

app.factory("collections", function () {

  /**
  * All avialable query types.
  */
  var queryType = {
    daily: "Daily",
    monthly: "Monthly",
    yearly: "Yearly"
  };

  /**
  * Class SubType.
  * @member {String} click.
  * @member {String} interval.
  */
  function SubTab(){
    this.click = "3080634";
    this.interval = "9403803"
  }

  /**
  * Class QueryInfo, represent all query condition.
  * @member {String} queryType.
  * @member {Number} dailyMonth.
  * @member {Number} dailyYear.
  * @member {Number} monthlyFrom.
  * @member {Number} monthlyTo.
  * @member {Number} yearlyFrom.
  * @member {Number} yearlyTo.
  * @member {Number} timeFrom.
  * @member {Number} timeTo.
  * @member {String} categoryA => category id.
  * @member {String} categoryB => category id.
  * @member {String} categoryC => category id.
  * @member {String} product => product id.
  * @member {String} branch => branch id.
  * @member {Boolean} groupByTime.
  */
  function QueryInfo() {
    this.queryType = queryType.daily;

    // Daily
    this.dailyMonth = 0;
    this.dailyYear = 0;

    // Monthly
    this.monthlyFrom = 0;
    this.monthlyTo = 0;

    // Yearly
    this.yearlyFrom = 0;
    this.yearlyTo = 0;

    // All type
    this.timeFrom = 0;
    this.timeTo = 0;

    this.categoryA = "";
    this.categoryB = "";
    this.categoryC = "";
    this.product = "";
    this.branch = "";

    // Group by time 10.00 - 11.00, 10.00 - 12.00
    this.groupByTime = false;

    // Prevent extend property.
    Object.preventExtensions(this);
  };

  /**
  * Function parse().
  * Convert all member from String to Number.
  */
  QueryInfo.prototype.parse = function () {

    this.dailyMonth = parseInt(this.dailyMonth);
    this.dailyYear = parseInt(this.dailyYear);
    this.monthlyFrom = parseInt(this.monthlyFrom);
    this.monthlyTo = parseInt(this.monthlyTo);
    this.yearlyFrom = parseInt(this.yearlyFrom);
    this.yearlyTo = parseInt(this.yearlyTo);
    this.timeFrom = parseInt(this.timeFrom);
    this.timeTo = parseInt(this.timeTo);

    var idLength = 24;

    if (this.categoryA.length != idLength) this.categoryA = "";
    if (this.categoryB.length != idLength) this.categoryB = "";
    if (this.categoryC.length != idLength) this.categoryC = "";
    if (this.product.length != idLength) this.product = "";
    if (this.branch.length != idLength) this.branch = "";
  };

  /**
  * Class Property.
  * @param {Object} key.
  * @param {Object} value.
  */
  function Property(key, value) {
    this.key = key;
    this.value = value;
  }

  /**
  * List of months and years.
  */
  var monthList = [];
  var yearList = [];

  /**
  * Append data into months.
  */
  for (var i = 0; i < 12; i++) {
    var text = moment(new Date(2012, i, 10)).format("MMMM");
    var month = new Property(i, text);
    monthList.push(month);
  }

  /**
  * Append data into years.
  */
  for (var i = 2014; i < 2020; i++) {
    var year = new Property(i, i.toString());
    yearList.push(year);
  }

  /**
  * Function getTimeList().
  * Return list of time series from 00 - 24.
  * @param {Boolean} plusInterval {Append (-) or not}
  * @return {Array}
  */
  function getTimeList(plusInterval) {
    var timeList = [];

    function genText(value) {
      if (value == "25") value = "1";

      var text = ("00" + value + ".00").substring(value.length);
      return text;
    }

    for (var i = 1; i <= 24; i++) {
      var value = (i ).toString();
      var text = genText(value);
      if (plusInterval) {
        text = text + " - " + genText((i + 1).toString());
      }$
      var time = new Property(i, text);
      timeList.push(time);
    }
    return timeList
  }

  /**
  * Publish all data here.
  */
  return {
    Property: Property,
    yearList: yearList,
    monthList: monthList,
    getTimeList: getTimeList,
    QueryInfo: QueryInfo,
    queryType: queryType,
    SubTab : SubTab
  }
});


app.factory("configService", function(){
    var endPoint = "http://10.0.0.77:8877";

    return {
     endPoint : endPoint
    };
});

/**
* Database service.
*/
app.factory("dbService", function($http){

  /**
  * Request get api.
  * @param {String} url.
  * @param {Function} callback.
  * @api {Private}
  */
  function get(url, callback) {
     var req =  $http({
      method: "GET",
      url: url
    });

    req.success(function(data){
      callback(data);
    });

    req.error(function(err){
      $scope.$emit("error", err);
      console.log(err);
    });
  }

  /**
  * Function post()
  * @param {String} url - Request url.
  * @param {Object} data - Post data.
  * @param {Function} callback - Request callback.
  * @api {Public}
  */
  function post(url, data, callback){
    var req = $http({
      method: "POST",
      url: url,
      data: JSON.stringify(data),
      header: { "Content-Type": "application/json" }
    });

    req.success(function(data){
      callback(data);
    });

    req.error(function(err){
      console.log(err);
    });
  }

  /**
  * Request product by example.
  * @param {Object} example - Conditions.
  * @param {Function} callback - Request callback.
  * @api {Public}
  */
  function findAllProductByExample(example, callback) {
    post("/api/product/query", example, callback);
  }

  /**
  * Request category by example.
  * @param {Object} example - Conditions.
  * @param {Function} callback - Request callback.
  * @api {Public}
  */
  function findAllCategoryByExample(example, callback) {
    post("/api/category/query", example, callback);
  }

  /**
  * Request all device information.
  * @param {Function} callback.$
  * @api {Public}
  */
  function findAllDevice(callback){
    get("/api/device", callback);
  }

  /**
  * Request all branchs.
  * @param {Function} callback.
  * @api {Public}
  */
  function findAllBranch(callback){
    get("/api/branch", callback);
  }

  /**
  * Request all products.
  * @param {Function} callback.
  * @api {Public}
  */
  function findAllProduct(callback) {
    get("/api/product", callback);
  }

  /**
  * Export all public function here.
  */
  return {
    findAllProductByExample: findAllProductByExample,
    findAllCategoryByExample: findAllCategoryByExample,
    findAllBranch: findAllBranch,
    findAllDevice: findAllDevice,
    post: post,
    get: get
  };
});


app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});

app.factory("globalService", function($http, $log, configService){

    var endPoint = configService.endPoint;

    function findAllCategory(callback){
        var url = endPoint + "/category";
        var request = $http({
            url : url,
            method: "GET"
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    function findAllProduct(callback){
        var url = endPoint + "/product";
        var request = $http({
           url : url,
           method : "GET"
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    function findAllBranch(callback) {
        var url = endPoint + "/branch";
        var request = $http({
            url : url,
            method : "GET"
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    function syncPirs() {
       var url = endPoint + "/pir/sync";
        var request = $http( {
            method: "GET",
            url: url
        });

        request.success(function(data){
            console.log("Sync pirs ok...");
        });

        request.error(function(err){
            console.log("Sync pirs failed...");
        });
    }
    function syncTouchs() {
       var url = endPoint + "/touch/sync";
        var request = $http({
            method : "GET",
            url : url
        });

        request.success(function(data){
            console.log("Sync touchs ok...");
        });

        request.error(function(err){
            console.log("Sync touchs failed...");
        });
    }

    return {
        findAllProduct : findAllProduct,
        findAllCategory : findAllCategory,
        findAllBranch : findAllBranch,
        syncAll : function() {
            syncPirs();
            syncTouchs();
        }
    };
});


app.factory("homeService", function($http, configService, $log){
    var endPoint = configService.endPoint;

    function querySummary(queryInfo, callback){
        var request = $http({
            url : endPoint + "/report/compare/summary",
            method: "POST",
            data : JSON.stringify(queryInfo),
            headers : { "Content-Type" : "multipart/form-data" }
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log(err);
        });
    }

    function queryChart(queryInfo, callback){
        var request = $http({
            url : endPoint + "/report/compare/chart",
            method : "POST",
            data : JSON.stringify(queryInfo),
            headers : { "Content-Type" : "multipart/form-data" }
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err)
        });
    }

    return {
        queryChart : queryChart,
        querySummary : querySummary
    };
});
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

/**
* Home controller, a1 and a2 report.
*/
app.controller("homeController", function ($scope, $log, collections, homeService, globalService) {

  /**
  * Local function
  * initDropdown
  * getDropdownValue
  * setDropdown
  * getScreenWidth
  * DropdownId
  * queryCallback
  */
  function initDropdown() {

    var d = new DropdownId();

    // Wait 0.1 sec. for drop down created...
    setTimeout(function(){
      $(d.dailyMonth).dropdown();
      $(d.dailyYear).dropdown();
      $(d.monthlyFrom).dropdown();
      $(d.monthlyTo).dropdown();
      $(d.yearlyFrom).dropdown();
      $(d.yearlyTo).dropdown();
      $(d.timeTo).dropdown();
      $(d.timeFrom).dropdown();
    }, 100);

    // Assign default value...
    setTimeout(function(){
      setDropdown(d.dailyMonth, $scope.months[0].key, $scope.months[0].value);
      setDropdown(d.dailyYear, $scope.years[0].key, $scope.years[0].value);

      setDropdown(d.monthlyFrom, $scope.months[0].key, $scope.months[0].value);
      setDropdown(d.monthlyTo, $scope.months[11].key, $scope.months[11].value);

      var yl = $scope.years.length - 1;
      setDropdown(d.yearlyFrom, $scope.years[0].key, $scope.years[0].value);
      setDropdown(d.yearlyTo, $scope.years[yl].key, $scope.years[yl].value);

      setDropdown(d.timeFrom, $scope.times[9].key, $scope.times[9].value);
      setDropdown(d.timeTo, $scope.times[10].key, $scope.times[10].value);
    }, 200);
  }

  /*
  * Get dropdown value.
  */
  function getDropdownValue(id) {
    var value = $(id).dropdown("get value");
    if (typeof(value) === "string") return value;
    return ""
  }

  /**
  * set drop down value
  * id = html id value
  * key = embedded key in dropdown
  * value = dropdown text
  */
  function setDropdown(id, key, value) {
    $(id).dropdown("set value", key).dropdown("set text", value)
  };

  /**
  * get current screen width
  * use jquery command
  */
  function getScreenWidth() {
    return $(window).width();
  }

  /**
  * Collection of dropdown id
  * Use as object with keyword "new"
  */
  function DropdownId() {
    this.dailyMonth = "#dailyMonth";
    this.dailyYear = "#dailyYear";

    this.monthlyFrom = "#monthlyFrom";
    this.monthlyTo = "#monthlyTo";

    this.yearlyFrom = "#yearlyFrom";
    this.yearlyTo = "#yearlyTo";

    this.timeFrom = "#timeFrom";
    this.timeTo = "#timeTo";

    this.categoryB = "#categoryB";
    this.categoryC = "#categoryC";

    this.product = "#product";
    this.branch = "#branch";
  };

  /**
  * Query report callback function.
  */
  function queryCallback(data) {
    console.log(data);
    createChart(data.columnNames, data.totalTouchs, data.totalPirs, data.totalSonics);
  }

  /**
  * Summary callback function.
  */
  function summaryCallback(data){
    // data from service
    // data.columnNames = list of column
    // data.touchInfos = [key, value] of TouchInfo (key = column name)
    // data.sonicInfos = [key, value], key is column name.
    // data.pirInfos = [key, value] of PIRInfo (key = column name)
    // data.devices = list of DeviceInfo
    console.log("<<SUM>>");
    console.log(data);
    $scope.sum = data;
  }

  /**
  * Group plain category into multi level.
  * There are 3 level "A", "B" and "C".
  */
  function groupCategory() {
    var all = { identifier: "", title: "All" }

    $scope.categoriesA = [];
    $scope.categoriesB = [all];
    $scope.categoriesC = [all];

    /**
    * If no parent this call category 'A'.
    */
    $scope.categories.forEach(function (cat) {
      if (!cat.parentId) {
        $scope.categoriesA.push(cat);
      }
    });

    /**
    * If parent is 'A' this is 'B'.
    */
    $scope.categoriesA.forEach(function (a) {
      $scope.categories.forEach(function (c) {
        if (c.parentId == a.identifier) {
          $scope.categoriesB.push(c);
        }
      });
    });

    /**
    * If parent is 'B' this is 'C'.
    */
    $scope.categoriesB.forEach(function (b) {
      $scope.categories.forEach(function (c) {
        if (c.parentId == b.identifier) {
          $scope.categoriesC.push(c);
        }
      });
    });
  }

  /**
  * Find product callback function.
  */
  function findAllProductCallback(data) {
    var all = { identifier: "", name: "All" };
    $scope.products = [all];

    data.forEach(function (d) {
      $scope.products.push(d);
    });

    $scope.productsReady = true;
  }

  /**
  * Find all category callback function.
  */
  function findAllCategoryCallback(data) {

    // Collect category data
    data.forEach(function (d) {
      $scope.categories.push(d);
    });

    // Group category A, category B, category C
    groupCategory();

    $scope.categoriesReady = true;
  }

  /**
  * Find all branch callback function.
  */
  function findAllBranchCallback(data) {
    var all = { identifier: "", name: "All "};
    $scope.branchs = [all];

    data.forEach(function (d) {
      $scope.branchs.push(d);
    });

    $scope.branchsReady = true;
  }

  /**
  * Query chart with given parameters
  * labels = Chart's label
  * touchs = Bar 1
  * passes = Bar 2
  * #chart is canvas element define in "views/homes/chart.html"
  */
  function createChart(labels, touchs, passes, sonics) {

    var options = {
      scaleLabel : "<%=value%>",
      scaleOverlay : true,
      scaleShowLabels : true
    };

    var data = {
      labels: labels,
      datasets: [
        {
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,1)",
          data: passes
        },
        {
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,1)",
          data: sonics
        },{
          fillColor: "rgba(10,87,05,0.5)",
          strokeColor: "rgba(151,187,205,1)",
          data: touchs
        }
      ]
    };

    var ctx = $("#chart").get(0).getContext("2d");
    var chart = new Chart(ctx).Bar(data, options);
  }

  /**
  * Query default query...
  * 1. Create default query object
  * 2. Start query and render result
  * 3. Init all drop down...
  */
  angular.element(document).ready(function () {

    var defaultQ = new collections.QueryInfo();
    homeService.queryChart(defaultQ, queryCallback);

    setTimeout(initDropdown, 300);

    globalService.findAllCategory(findAllCategoryCallback);
    globalService.findAllProduct(findAllProductCallback);
    globalService.findAllBranch(findAllBranchCallback);

    var id = new DropdownId();

    var pi = setInterval(function () {
      if ($scope.productsReady) {
        $scope.$apply();
        $(id.product).dropdown().dropdown("set value", '"');
        clearInterval(pi);
      }
    }, 500);

    var ci = setInterval(function () {
      if ($scope.categoriesReady) {
        $scope.$apply();
        $(id.categoryB).dropdown().dropdown("set value", "");
        $(id.categoryC).dropdown().dropdown("set value", "");
        clearInterval(ci);
      }
    }, 500);

    var bi = setInterval(function () {
      if ($scope.branchsReady) {
        $scope.$apply();
        $(id.branch).dropdown().dropdown("set value", "");
        clearInterval(bi);
      }
    }, 500);

    globalService.syncAll()
  });

  /**
  * All scope variables
  * months = list of months (drop down)
  * years = list of years (drop down)
  * times = list of times (drop down)
  * currentQuery = query object (have many properties, see collections.js)
  * queryType = can be "Daily", "Monthly" "Yearly" (see collections.js)
  * screenWidth = current browser width
  */
  $scope.months = collections.monthList;
  $scope.years = collections.yearList;
  $scope.times = collections.getTimeList(false);
  $scope.currentQuery = new collections.QueryInfo();
  $scope.queryType = collections.queryType;
  $scope.screenWidth = getScreenWidth();
  $scope.products = [];
  $scope.categories = [];
  $scope.branchs = [];
  $scope.productsReady = false;
  $scope.categoriesReady = false;
  $scope.branchsReady = false;
  $scope.categoriesA = [];
  $scope.categoriesB = [];
  $scope.categoriesC = [];
  $scope.selectedCatB = "";
  $scope.selectedCatC = "";
  $scope.sum = {};

  /**
  * Seft apply.
  * from https://coderwall.com/p/ngisma
  */
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  /**
  * Change query type (trigger by 3 top button)
  */
  $scope.selectQueryType = function (type) {
    $scope.currentQuery.queryType = type;
  };

  /**
  * Check is type equal to current query type.
  */
  $scope.isSelected = function (type) {
    return type === $scope.currentQuery.queryType;
  }

  /**
  * Update selected categoryB.
  */
  $scope.selectCategoryB = function (cat) {
    $scope.selectedCatB = cat.identifier;
  };

  /**
  * Update selected categoryC.
  */
  $scope.selectCategoryC = function (cat) {
    $scope.selectedCatC = cat.identifier;
  }

  /**
  * Get pir information by key and device id.
  */
  $scope.getPirInfos = function(key, device) {
    var pirs = $scope.sum.pirInfos[key];
    var match = _.where(pirs, { deviceId : device.serialNumber} );
    return match;
  };

  /**
  * Get sonic information by key and device id.
  */
  $scope.getSonicInfos = function(key, device) {
    var sonics = $scope.sum.sonicInfos[key];
    var match = _.where(sonics, { deviceId : device.serialNumber });
    return match;
  };

  /**
  * Get touch information by key and device id.
  */
  $scope.getTouchInfos = function(key, device) {
    var touchs = $scope.sum.touchInfos[key];
    var match = _.where(touchs, { deviceId : device.serialNumber} );
    return match;
  };

  /**
  * Change tab.
  */
  $scope.$on("changeSubTab", function(event, selected){

    function resetDropdown() {
      var tab = new collections.SubTab();
      if(selected === tab.click) {
        $scope.currentQuery.groupByTime = false;
        $scope.times = collections.getTimeList(false);
      }else {
        $scope.currentQuery.groupByTime = true;
        $scope.times = collections.getTimeList(true);
      }

      setTimeout(function(){
        // Recreate drop down item...
        var d = new DropdownId();
        $(d.timeFrom).dropdown();
        $(d.timeTo).dropdown();
        // Set default value...
        setDropdown(d.timeFrom, $scope.times[9].key, $scope.times[9].value);
        setDropdown(d.timeTo, $scope.times[10].key, $scope.times[10].value);
      }, 100);
    }
    resetDropdown()
  });

  /*
  * Start query process...
  * 1. Get ID object (dedicate for drop down element)
  * 2. Get value from drop down element
  * 3. Parse value into integer (q.parse())
  * 4. Try to redraw chart width...
  * 5. Start query via homeSevice (see home_service.js)..
  * 6. Return value will process within queryCallback function ( above ^ )
  */
  $scope.startQuery = function () {

    // Borrow currentQuery instance...
    var q = $scope.currentQuery;
    var d = new DropdownId();

    q.dailyMonth = getDropdownValue(d.dailyMonth);
    q.dailyYear = getDropdownValue(d.dailyYear);

    q.monthlyFrom = getDropdownValue(d.monthlyFrom);
    q.monthlyTo = getDropdownValue(d.monthlyTo);

    q.yearlyFrom = getDropdownValue(d.yearlyFrom);
    q.yearlyTo = getDropdownValue(d.yearlyTo);

    q.timeFrom = getDropdownValue(d.timeFrom);
    q.timeTo = getDropdownValue(d.timeTo);

    q.categoryB = getDropdownValue(d.categoryB);
    q.categoryC = getDropdownValue(d.categoryC);
    q.product = getDropdownValue(d.product);
    q.branch = getDropdownValue(d.branch);

    q.parse();

    $scope.screenWidth = getScreenWidth();
    homeService.queryChart(q, queryCallback);
    homeService.querySummary(q, summaryCallback);
  };

  /**
  * Reset all dropdown input.
  */
  $scope.clear = function () {
    initDropdown();
  };

  /**
  * Get duplicate column.
  */
  $scope.getDuplicateColumns = function(){
    var cs = [];
    $scope.sum.columnNames.forEach(function(c){
      cs.push(c + "pir");
      cs.push(c + "sonic");
      cs.push(c + "touch");
    });
    return cs;
  }
});

app.controller("mainController", function($scope, collections){

    $scope.tab = new collections.SubTab();
    $scope.selectedTab = $scope.tab.click;

    $scope.selectTab = function(tab){
        $scope.selectedTab = tab;
        $scope.$broadcast("changeSubTab", tab);
    }

    $scope.isSelected = function(tab){
        return $scope.selectedTab == tab;
    }

    angular.element(document).ready(function(){
      $(".ko-touch-dropdown").dropdown();
      $(".ko-comparison-dropdown").dropdown();
    });

});

/**
* @controller touch001Controller -
*/
app.controller("touch001Controller", function($scope, models, $rootScope, dbService){

  $scope.message = "Hello message";

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, data){

    // Parse query
    var query = models.parseQuery(data);

    // Request...
    dbService.post("/report/touch001", query, function(data){
      $rootScope.$broadcast("displayGraph", data);
      $rootScope.$broadcast("displayTable", data);
    });

  });
});


/**
* @controller touch002Controller -
*/
app.controller("touch002Controller", function($scope, models, $rootScope, dbService){

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, data){

    // Parse query.
    var query = models.parseQuery(data);

    // Start request.
    dbService.post("/report/touch001", query, function(data){
      $rootScope.$broadcast("displayGraph", data);
      $rootScope.$broadcast("displayTable", data);
    });

  });
});

/**
* @controller touch003Controller -
*/
app.controller("touch003Controller", function($scope, models, $rootScope, dbService){

  /**
  * Find all category B in database.
  * Keep reference on $scope.categoriesB.
  */
  dbService.findAllCategoryByExample({ delete: false}, function(cats){
    var categoriesA = _.filter(cats, function(x){ return x.parentId === undefined;});
    var ids = _.map(categoriesA, function(x) { return x._id; });
    var categoriesB = _.filter(cats, function(x){ return ids.indexOf(x.parentId) != -1; });

    $scope.categories = cats;
    $scope.categoriesB = categoriesB;
    $scope.allCategoriesB = categoriesB;

  });

  dbService.findAllProductByExample({delete:false, archive:false}, function(products){
    $scope.products = products;
  });

  /**
  * Scrop variables.
  * @variable {Array} categoriesB - Current category B.
  * @variable {Array} categories - All categories.
  * @variable {Array} allCategoriesB
  * @variable {Array} product
  */
  $scope.categoriesB = [];
  $scope.categories = [];
  $scope.allCategoriesB = [];
  $scope.products = [];

  /**
  * Check is product is under specific category.
  * @param {String} productId.
  * @param {String} categoryId.
  * @return {Boolean}.
  */
  $scope.isInCategoryB = function(productId, categoryId) {
    var all = $scope.categories;
    var products = $scope.products;
    var product = _.filter(products, function(x) { return x._id == productId })[0];

    if(!product) return false;

    var c = _.filter(all, function(x) { return product.categoryIds.indexOf(x._id) != -1; })[0];
    var b = _.filter(all, function(x) { return c.parentId == x._id; })[0];
    return b._id == categoryId;
  };

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, form){

    /**
    * Parse form data as specific query (can understand by server).
    */
    var query = models.parseQuery(form);
    var levelAId= form.categoryA._id;
    if(levelAId){
      var all = $scope.categories;
      var nbs = _.filter(all, function(x){ return x.parentId === levelAId; });
      $scope.categoriesB = nbs;
    }else {
      $scope.categoriesB = $scope.allCategoriesB;
    }

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(data){


      var columnIds = [];

      /**
      * Get column summary.
      * @param {String} column - Column value use as query key.
      * @return {Number} - Caculation result.
      */
      function getBranchSum(column) {
        var columnDatas= data.datas[column];
        if(!columnDatas) return 0;
        return columnDatas.length;
      }

      /**
      * Get element value.
      * Value compose from column and row.
      * @param {String} column - Column value.
      * @param {Number} $index - Row index.
      * @return {Number} - Caculation result.
      */
      function getBranchRecord(column, $index) {

        var columnDatas = data.datas[column];
        var rows = [];

        if(!columnDatas) return 0;

        var rs = 0;
        columnDatas.forEach(function(el){
          var catB = columnIds[$index];
          var ok = $scope.isInCategoryB(el.objectId, catB);
          if(ok) rs ++;
        });

        return rs;
      }

      /**
      * showGraph()
      * @param {Array} columns - Columns to render.
      * @param {Value} values - Graph values.
      */
      function showGraph(columns, values) {
        var graph = {
          columns: columns,
          values: values
        };

        $rootScope.$broadcast("displayGraph", graph);
      }

      /**
      * Function showTable()
      * Pass addition info into directive template.
      */
      function showTable(columns, values) {
        data.rows = columns;
        data.getBranchRecord = getBranchRecord;
        data.getBranchSum = getBranchSum;
        $rootScope.$broadcast("displayTable", data);
      }

      function createRowAndValue() {
        /**
      * Transform original data into prefer format.
      */
        var columns =  _.map($scope.categoriesB, function(x) { return x.title; });
        var columnIds = _.map($scope.categoriesB, function(x) { return x._id; });
        var values = [];

        /**
      * Create graph values.
      */
        var index = 0;
        columnIds.forEach(function(column){
          var length = 1;
          data.datas.forEach(function(touchs){
            touchs.forEach(function(touch){
              var match = $scope.isInCategoryB(touch.objectId, column);
              if(match) length ++;
            });
          });

          values[index++] = length;
        });

        return {
          values: values,
          columns: columns,
          columnIds: columnIds
        };
      }

      /**
      * Render to screen.
      */
      var rv = createRowAndValue();
      columnIds = rv.columnIds;
      showGraph(rv.columns, rv.values);
      showTable(rv.columns, rv.values);

    });
  });
});


/**
* @controller touch003Controller -
*/
app.controller("touch004Controller", function($scope, models, $rootScope, dbService){

  dbService.findAllCategoryByExample({ delete: false}, function(data){
    $scope.categories = data;
    var aa = _.filter(data, function(x){ return x.parentId == null; });
    var aaids = _.map(aa, function(x){ return x._id; });
    var bb = _.filter(data, function(x) { return aaids.indexOf(x.parentId) != -1; });
    var bbids = _.map(bb, function(x) { return x._id; });
    var cc = _.filter(data, function(x){ return bbids.indexOf(x.parentId) != -1;});
    $scope.allCategoriesC = cc;
  });

  dbService.findAllProductByExample({delete: false}, function(data){
    $scope.products = data;
  });

  /**
  * Scrop variable.
  */
  $scope.categoriesC = [];
  $scope.categories = [];
  $scope.products = [];
  $scope.allCategoriesC = [];

  /**
  * Check is product is under specific category.
  * @param {String} productId.
  * @param {String} categoryId.
  * @return {Boolean}.
  */
  $scope.isInCategoryC = function(productId, categoryId) {

    var all = $scope.categories;
    var products = $scope.products;
    var product = _.filter(products, function(x) { return x._id == productId })[0];

    if(!product) return false;
    var c = _.filter(all, function(x) { return product.categoryIds.indexOf(x._id) != -1; })[0];
    return c._id == categoryId;
  };

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, form){

    /**
    * Parse form data as specific query (can understand by server).
    */
    var query = models.parseQuery(form);
    var levelBId= form.categoryB._id;
    if(levelBId){
      var all = $scope.categories;
      var nbs = _.filter(all, function(x){ return x.parentId === levelBId; });
      $scope.categoriesC = nbs;
    }else {
      $scope.categoriesC = $scope.allCategoriesC;
    }

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(record){

      var columnIds = [];

      /**
      * Get column summary.
      * @param {String} column - Column value use as query key.
      * @return {Number} - Caculation result.
      */
      function getBranchSum(column) {
        var columnDatas= record.datas[column];
        if(!columnDatas) return 0;
        return columnDatas.length;
      }

      /**
      * Get element value.
      * Value compose from column and row.
      * @param {String} column - Column value.
      * @param {Number} $index - Row index.
      * @return {Number} - Caculation result.
      */
      function getBranchRecord(column, $index) {

        var columnDatas = record.datas[column];
        var rows = [];

        if(!columnDatas) return 0;

        var rs = 0;
        columnDatas.forEach(function(el){
          var catC = columnIds[$index];
          var ok = $scope.isInCategoryC(el.objectId, catC);
          if(ok) rs ++;
        });

        return rs;
      }

      /**
      * showGraph()
      * @param {Array} columns - Columns to render.
      * @param {Value} values - Graph values.
      */
      function showGraph(columns, values) {
        var graph = {
          columns: columns,
          values: values
        };

        $rootScope.$broadcast("displayGraph", graph);
      }

      /**
      * Function showTable()
      * Pass addition info into directive template.
      */
      function showTable(columns, values) {
        record.rows = columns;
        record.getBranchRecord = getBranchRecord;
        record.getBranchSum = getBranchSum;
        $rootScope.$broadcast("displayTable", record);
      }

      function createRowAndValue() {
        /**
      * Transform original data into prefer format.
      */
        var inx = 1;
        var columns =  _.map($scope.categoriesC, function(x) { return (inx++) + ". " + x.title; });
        var columnIds = _.map($scope.categoriesC, function(x) { return x._id; });
        var values = [];

        /**
      * Create graph values.
      */
        var index = 0;
        columnIds.forEach(function(column){
          var length = 1;
          record.datas.forEach(function(touchs){
            touchs.forEach(function(touch){
              var match = $scope.isInCategoryC(touch.objectId, column);
              if(match) length ++;
            });
          });

          values[index++] = length;
        });

        return {
          columns: columns,
          columnIds: columnIds,
          values: values
        };
      }

      /**
      * Render to screen.
      */
      var rv = createRowAndValue();
      columnIds = rv.columnIds;
      showGraph(rv.columns, rv.values);
      showTable(rv.columns, rv.values);

    });
  });
});


/**
* @controller touch003Controller -
*/
app.controller("touch005Controller", function($scope, models, $rootScope, dbService){

  var allProducts = [];

  /**
  * Find all category C.
  * Keep reference on $scope.allCategoriesC.
  */
  dbService.findAllCategoryByExample({ delete: false}, function(data){
    $scope.categories = data;
    var aa = _.filter(data, function(x){ return x.parentId == null; });
    var aaids = _.map(aa, function(x){ return x._id; });
    var bb = _.filter(data, function(x) { return aaids.indexOf(x.parentId) != -1; });
    var bbids = _.map(bb, function(x) { return x._id; });
    var cc = _.filter(data, function(x){ return bbids.indexOf(x.parentId) != -1;});
    $scope.allCategoriesC = cc;
  });

  /*
  * Find all prodcuts.
  * Keep reference on $scope.products && allProducts.
  */
  dbService.findAllProductByExample({delete: false}, function(data){
    $scope.products = data;
    allProducts = data;
  });

  /**
  * Scrop variable.
  */
  $scope.categoriesC = [];
  $scope.categories = [];
  $scope.products = [];
  $scope.allCategoriesC = [];

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, form){

    /**
    * Parse form data as specific query (can understand by server).
    */
    var query = models.parseQuery(form);
    var levelBId= form.categoryB._id;
    if(levelBId){
      var all = $scope.categories;
      var nbs = _.filter(all, function(x){ return x.parentId === levelBId; });
      $scope.categoriesC = nbs;
    }else {
      $scope.categoriesC = $scope.allCategoriesC;
    }

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(record){

      var columnIds = [];

      /**
      * Get column summary.
      * @param {String} column - Column value use as query key.
      * @return {Number} - Caculation result.
      */
      function getBranchSum(column) {
        var columnDatas= record.datas[column];
        if(!columnDatas) return 0;
        return columnDatas.length;
      }

      /**
      * Get element value.
      * Value compose from column and row.
      * @param {String} column - Column value.
      * @param {Number} $index - Row index.
      * @return {Number} - Caculation result.
      */
      function getBranchRecord(column, $index) {
        var columnDatas = record.datas[column];
        var rows = [];

        if(!columnDatas) return 0;

        var matchs = _.filter(columnDatas, function(x){
          var product = columnIds[$index];
          return product == x.objectId;
        });

        return matchs.length;
      }

      /**
      * showGraph()
      * @param {Array} columns - Columns to render.
      * @param {Value} values - Graph values.
      */
      function showGraph(columns, values) {
        var graph = {
          columns: columns,
          values: values
        };

        $rootScope.$broadcast("displayGraph", graph);
      }

      /**
      * Function showTable()
      * Pass addition info into directive template.
      */
      function showTable(columns, values) {
        record.rows = columns;
        record.getBranchRecord = getBranchRecord;
        record.getBranchSum = getBranchSum;
        $rootScope.$broadcast("displayTable", record);
      }

      /**
      * Transform original data into prefer format.
      */
      function getProducts() {
        var products = _.filter(form.products, function(x) { return typeof(x._id) != "undefined"; });
        var finals = [];

        if(form.categoryC._id) {
          finals = _.filter(products, function(x) { return x.categoryIds.indexOf(form.categoryC._id) != -1; });
        }else {
          finals = allProducts;
        }

        return finals;
      }

      /**
      * Create rows....
      */
      function createRowAndValue() {
        var products = getProducts();
        var idx = 1;
        var columns =  _.map(products, function(x) { return  (idx++) + ". " + x.name; });
        var columnIds = _.map(products, function(x) { return x._id; });
        var values = [];

        var index = 0;
        columnIds.forEach(function(column){
          var length = 1;
          record.datas.forEach(function(touchs){
            touchs.forEach(function(touch){
              var match = touch.objectId === column;
              if(match) length ++;
            });
          });

          values[index++] = length;
        });

        return {
          columns: columns,
          values: values,
          columnIds: columnIds
        };
      };

      /**
      * Render grap and table here.
      */
      var rv = createRowAndValue();
      columnIds = rv.columnIds;
      showGraph(rv.columns, rv.values);
      showTable(rv.columns, rv.values);

    });
  });
});

app.controller("touch006Controller", function($scope, dbService, models, $rootScope){

  var allProducts = [];

  /**
  * Find category and all category 'C'.
  * Load immediately.
  */
  dbService.findAllCategoryByExample({ delete: false}, function(data){
    $scope.categories = data;
    var aa = _.filter(data, function(x){ return x.parentId == null; });
    var aaids = _.map(aa, function(x){ return x._id; });
    var bb = _.filter(data, function(x) { return aaids.indexOf(x.parentId) != -1; });
    var bbids = _.map(bb, function(x) { return x._id; });
    var cc = _.filter(data, function(x){ return bbids.indexOf(x.parentId) != -1;});
    $scope.allCategoriesC = cc;
  });

  /**
  * Find all products in database via web service.
  * Load immediately.
  */
  dbService.findAllProductByExample({delete: false}, function(data){
    $scope.products = data;
    allProducts = data;
  });

  /**
  * Scrop variable.
  */
  $scope.categoriesC = [];
  $scope.categories = [];
  $scope.products = [];
  $scope.allCategoriesC = [];

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, form){

    /**
    * Parse form data as specific query (can understand by server).
    * If category B was selected, filter only category under B.
    * Otherwise use all category in level C.
    */
    var query = models.parseQuery(form);
    var levelBId= form.categoryB._id;
    if(levelBId){
      var all = $scope.categories;
      var nbs = _.filter(all, function(x){ return x.parentId === levelBId; });
      $scope.categoriesC = nbs;
    }else {
      $scope.categoriesC = $scope.allCategoriesC;
    }

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(record){

      var columnIds = [];

      function sortTouch(counts) {
        var sortable = [];
        for(var key in counts) {
          sortable.push([key, counts[key]]);
        }
        sortable.sort(function(a,b){ return b[1] - a[1] });
        return sortable;
      }

      /**
      * Get column summary.
      * @param {String} column - Column value use as query key.
      * @return {Number} - Caculation result.
      */
      function getBranchSum(column) {
        var columnDatas= record.datas[column];
        if(!columnDatas) return 0;
        return columnDatas.length;
      }

      /**
      * Get element value.
      * Value compose from column and row.
      * @param {String} column - Column value.
      * @param {Number} $index - Row index.
      * @return {Number} - Caculation result.
      */
      function getBranchRecord(column, $index) {

        var columnDatas = record.datas[column];
        var rows = [];

        var counts = _.countBy(columnDatas, function(x) { return x.objectId; });
        var sortable = sortTouch(counts);
        var topN = sortable[$index];
        if(topN) {
          var productId = topN[0];
          var product = _.find(getProducts(), { _id: productId});
          return product.name;
        }
        return "N/A";
      }

      /**
      * showGraph()
      * @param {Array} columns - Columns to render.
      * @param {Value} values - Graph values.
      */
      function showGraph(columns, values) {
        var graph = {
          columns: columns,
          values: values
        };

        $rootScope.$broadcast("displayGraph", graph);
      }

      /**
      * Function showTable()
      * Pass addition info into directive template.
      */
      function showTable(columns, values) {
        record.rows = columns;
        record.getBranchRecord = getBranchRecord;
        record.getBranchSum = getBranchSum;
        $rootScope.$broadcast("displayTable", record);
      }

      /**
      * Function getProduct()
      * Transform original data into prefer format.
      */
      function getProducts() {
        var products = _.filter(form.products, function(x) { return typeof(x._id) != "undefined"; });
        var finals = [];

        if(form.categoryC._id) {
          finals = _.filter(products, function(x) { return x.categoryIds.indexOf(form.categoryC._id) != -1; });
        }else {
          finals = allProducts;
        }
        return finals;
      }

      /**
      * Function createRowAndValue()
      * Create rows and values.
      */
      function  createRowAndValue() {

        var columns = [],
            columnIds =[],
            values = [],
            touchs =[],
            products = getProducts();

        for(var key in record.datas){
          var v = record.datas[key];
          touchs.push.apply(touchs, v);
        }

        var counts = _.countBy(touchs, function(x){ return x.objectId; });
        var sortable = sortTouch(counts);

        for(var key in sortable){
          var vs = sortable[key];
          var productId = vs[0];
          var count = vs[1];
          var product = _.find(products, { _id: productId });

          var columnName = product.name;
          columns.push(columnName);
          columnIds.push(productId);
          values.push(count);
        }

        return {
          columns: columns,
          values: values,
          columnIds: columnIds
        }
      }

      /**
      * Render to screen.
      */
      var rv = createRowAndValue();
      var columns = rv.columns.slice(0,10);
      var values = rv.values.slice(0,10);
      columnIds = rv.columnIds.slice(0,10);

      showGraph(columns, values);
      showTable(columns, values);

    });
  });
});

app.directive("touchForm", function(models, collections, dbService){

  /**
  * Directive :controller definition.
  */
  function controller($scope) {

    /**
    * Append 'All' text into dropdwon list.
    * @param {Array} items - Input array.
    */
    function appendAll(items) {
      var all = new collections.Property(0, "All");
      items.unshift(all);
    }

    /**
    * Append 'All' into branch dropdown.
    */
    function appendDefaultBranch(branchs) {
      branchs.unshift({name: "All"});
    }

    /**
    * Append 'All' into device dropdown.
    */
    function appendDefaultDevice(devices) {
      devices.unshift({deviceId: "All"});
    }

    /**
    * Append 'All' as default category title.
    */
    function appendDefaultCategory(categories) {
      categories.unshift({ title: "All", _id: 0 });
    }

    /**
    * Prepend 'Alll' as default product title.
    */
    function appendDefaultProduct(products){
      products.unshift({ name: "All"});
    }

    /**
    * Function createQueryCondition().
    * return {Object} - New instance of TouchCondition with default value.
    */
    function createQueryCondition() {
      var form = new models.TouchCondition();
      form.reportType = "Daily";
      return form;
    }

    /**
    * Init branchs.
    */
    dbService.findAllBranch(function(data){
      appendDefaultBranch(data);
      $scope.form.branchs = data;
      $scope.form.branch = data[0];
    });

    /**
    * Init products.
    */
    dbService.findAllDevice(function(data){
      appendDefaultDevice(data);
      $scope.form.devices = data;
      $scope.form.device = data[0];
    });

    /**
    * Init level 'A' category.
    */
    dbService.findAllCategoryByExample( { parentId: null }, function(data){
      var form = $scope.form;
      appendDefaultCategory(data);
      form.categoriesA = data;
      form.categoryA = data[0];
    });

    /**
    * Init query condition.
    * Default report type is "Daily".
    */
    $scope.form = createQueryCondition();

    /**
    * Assign default form values.
    */
    var form = $scope.form;
    form.dailyMonth = form.months[0];
    form.dailyYear = form.years[0];
    form.timeFrom =  form.times[0];
    form.timeTo = form.times[form.times.length-1];
    form.monthlyFrom = form.months[0];
    form.monthlyTo = form.months[form.months.length-1];
    form.yearlyFrom = form.years[0];
    form.yearlyTo = form.years[form.years.length-1];

    /**
    * Is user selected any branch.
    * @return {String} - Null or branch's _id
    */
    $scope.isBranchSet = function() {
      if($scope.form.branch) {
        return $scope.form.branch._id != null;
      }
    };

    /**
    * Function changeCategory().
    * @param {String} category - Category level ('A', 'B' or 'C').
    * @api {Public}
    */
    $scope.changeCategory = function(cat) {
      var form = $scope.form;
      if(cat === "A") {
        // Reset category B...
        var a = form.categoryA;
        dbService.findAllCategoryByExample( { parentId: a._id }, function(data){
          appendDefaultCategory(data);
          form.categoriesB = data;
          form.categoryB = data[0];
        });
      }else if(cat === "B") {
        // Reset category C...
        var b = form.categoryB;
        dbService.findAllCategoryByExample( { parentId: b._id }, function(data){
          appendDefaultCategory(data);
          form.categoriesC = data;
          form.categoryC = data[0];
        });
      }else if(cat === "C") {
        // Reset product.
        var c = form.categoryC;
        var cons = {
          categoryIds: { $all : [c._id] }
        };

        dbService.findAllProductByExample(cons,  function(data){
          appendDefaultProduct(data);
          form.products = data;
          form.product = data[0];

          console.log(form.products);
        });
      }
    };

    $scope.show = function(cat) {
      var set = $scope.isCategorySet;
      var rs = false;
      if(cat === "A")  {
        rs = $scope.showCategoryA;
      }
      else if(cat === "B") {
        rs = set("A") && $scope.showCategoryB;
      }
      else if(cat === "C") {
        rs = set("A") && set("B") && $scope.showCategoryC;
      }
      else if(cat === "P") {
        rs = set("A") && set("B") && set("C") && $scope.showProduct;
      }

      return rs;
    };

    /**
    * Is specific category valid or not.
    * @param {String} c - Category level ('A', 'B' or 'C')
    * @return {Boolean} - Is category ok.
    */
    $scope.isCategorySet = function(c){
      var f = $scope.form;
      if(c === 'A') return f.categoryA._id !== 0;
      else if(c === 'B') return f.categoryB._id !== 0;
      else if(c === 'C') return f.categoryC._id !== 0;
    };

    /**
    * User select new branch dropdown.
    * We need to reload device up to selected branch.
    */
    $scope.changeBranch = function() {
      var devs = $scope.form.devicesInBranch;

      // Result device dropdowns.
      devs.length = 0;
      appendDefaultDevice(devs);
      $scope.form.device = devs[0];

      var branch = $scope.form.branch;
      var devices = $scope.form.devices;

      if(!branch.deviceIds) return;

      branch.deviceIds.forEach(function(id){
        var dev = _.find(devices, { _id: id});
        if(dev) devs.push(dev);
      });
    }

    /**
    * Set report type. (Dialy, Monthly or Yearly).
    */
    $scope.setType = function(type) {
      $scope.form.reportType = type;
    };

    /**
    * Is current type match given type.
    */
    $scope.isSet = function(type) {
      return $scope.form.reportType === type;
    };

    /**
    * Emit start query event to parent conroller.
    */
    $scope.startQuery = function() {
      $scope.$emit("startQuery", $scope.form);
      console.log($scope.form);
    };
  }

  /**
  * Directive :link definition.
  */
  function link(scope, el, attr) {
  }

  /**
  * Directive object definition.
  */
  return {
    restrict: "E",
    scope: {
      showCategoryA: "=",
      showCategoryB: '=',
      showCategoryC: '='
    },
    controller: controller,
    templateUrl: "/views/directives/touchFormDirective.html",
    link: link
  };
});

app.directive("touchGraph", function(){

  /**
  * Function getRandomColor()
  * @api {Public}
  * @return {String} - Random color.
  */
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function generatePie(graph) {
     // Provide doughnut data.
    var data = [];
    var range = _.range(0, graph.values.length);

    range.forEach(function(r){
      data.push({
        color: getRandomColor(),
        value: graph.values[r]
      });
    });
    return data;
  }

  /**
  * Function doughnut()
  * @param {Object} graph - Input datas.
  * @param {Object} ctx - 2D context object.
  * @return {Object} - Chart object.
  */
  function doughnut(graph, ctx) {
    var data = generatePie(graph);

    //console.log(data);
    // Create doughnut chart.
    var chart = new Chart(ctx).Doughnut(data);
    return chart;
  }

  /**
  * Function pie().
  * Create pie chart.
  * @param {Object} graph - Input data.
  * @param {Object} ctx - 2D context object.
  * @return {Object}
  */
  function pie(graph, ctx) {
    var data = generatePie(graph);
    var chart = new Chart(ctx).Pie(data);
    return chart;
  }

  /**
  * Function bar().
  * Create bar chart.
  * @param {Object} graph - Input data.
  * @param {Object} ctx - 2D context object.
  * @return {Object} - Chart object.
  */
  function bar(graph, ctx) {

    var options = {
      scaleLabel : "<%=value%>",
      scaleOverlay : true,
      scaleShowLabels : true
    };
    // Provider bar data.
    var data = {
      labels: graph.columns,
      datasets: [
        {
          fillColor: "rgba(220,220,220,0.8)",
          strokeColor: "rgba(220,220,220,1)",
          data: graph.values
        }
      ]
    };
    // Create bar chart.
    var chart = new Chart(ctx).Bar(data, options);
    return chart;

  }

  /**
  * Function renderGraph().
  * @param {Object} graph - Input datas.
  * @api {Private}
  */
  function renderGraph(graph, chartType) {
    var ctype = chartType || "Bar";
    var ctx = $("#chart").get(0).getContext("2d");
    if(ctype === "bar") {
      var chart = bar(graph, ctx);
    }else if(ctype === "doughnut") {
      var graph = doughnut(graph, ctx);
    }else if(ctype === "pie") {
      var graph = pie(graph, ctx);
    }
  }

  /**
  * Function controller().
  * @param {Object} $scope - Angular auto inject $scope.
  * @api {Private}
  */
  function controller($scope) {

    function normal(datas) {
      var graph = $scope.graph = {};
      graph.values = datas.values;
      graph.columns = datas.columns;
      graph.datas = datas.datas;
      return graph;
    }

    $scope.graph = {};

    $scope.$on("displayGraph", function(event, datas){
      var graph = normal(datas);
      $scope.graph = graph;
      renderGraph(graph, $scope.chartType);
    });
  }

  /**
  * Function link().
  * @api {Private}
  */
  function link() { }

  /**
  * Return directive object.
  */
  return {
    restrict: "E",
    controller: controller,
    scope: {
      chartType: "@"
    },
    link: link,
    templateUrl: "/views/directives/touchGraphDirective.html"
  }
});

/**
* Directive "touchTable".
* Render input data as html table.
*/
app.directive("touchTable", function($compile, $http){

  /**
  * Function controller.
  * @parem {Object} $scope - Angular auto inject scope.
  * @param {Object} dbService - Custom service..
  * @api {Private}
  */
  function controller($scope, dbService) {

    /**
    * Find all device in database via web service.
    * Assign result into $scope.devices.
    */
    dbService.findAllDevice(function(data){
      $scope.devices = data;
    });

    /**
    * Function getRecord()
    * Return lenght of data.
    * @param {String} deviceId.
    * @param {Number} columnIndex.
    * @return {Number}
    */
    $scope.getRecord = function(deviceId, columnIndex) {
      var records = $scope.records;
      var record = records.datas[columnIndex];
      var rs = _.filter(record, function(r) { return r.deviceId === deviceId });
      return rs.length;
    };

    /**
    * Function getSum()
    * @param {Number} $index - Column index.
    * @return {Number}
    */
    $scope.getSum = function($index) {
      var rs = $scope.records.datas[$index].length;
      return rs;
    };

    /**
    * Broadcast handler.
    * Watch "displayTable" event from $rootScope.
    */
    $scope.$on("displayTable", function(event, data){
      var records = $scope.records = data;
      window.records = records;
    });

    /**
    * All $scope variables.
    */
    $scope.datas = {};
    $scope.devices = [];
    $scope.htmlTemplate = "/views/directives/touchTableDirective.html";
  }

  /**
  * Function link()
  * Directive linking function.
  * Load template dynamic from htmlTemplate attribute.
  * Then compile template with current scope.
  * @param {Object} $scope - Scrop variable.
  * @param {Object} element - Directive element.
  * @param {Object} attributes - Directive attrbiutes.
  */
  function link($scope, element, attributes) {
    var url = attributes.htmlTemplate;
    var request = $http.get(url);
    request.success(function(data){
      element.html(data);
      $compile(element.contents())($scope);
    });
  }

  /**
  * Return directive definition here.
  * TODO: Change tempalte url dynaimically.
  */
  return {
    restrict: "E",
    controller: controller,
    link: link
    //templateUrl: '<ng-include src="{{htmlTemplate}}></ng-include>'
  };
});
