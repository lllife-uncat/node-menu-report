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
          data: touchs
        },{
          fillColor: "rgba(10,87,05,0.5)",
          strokeColor: "rgba(151,187,205,1)",
          data: sonics
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
