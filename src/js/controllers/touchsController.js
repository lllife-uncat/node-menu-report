/**
* @controller touch001Controller -
*/
app.controller("touch001Controller", function($scope, models, $http, $rootScope){

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
    return query;
  }

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, data){
    var query = parseQuery(data);
    var request = $http({
      url: "/report/touch001",
      method: "POST",
      data: query,
      header: { "Content-Type": "application/json" }
    });

    request.success(function(data) {
      $rootScope.$broadcast("displayGraph", data);
      $rootScope.$broadcast("displayTable", data);
    });

    request.error(function(err){
      console.log(err);
    });

  });

  $scope.form = {};
});

/**
* @controller touch002Controller -
*/
app.controller("touch002Controller", function($scope, models){
  $scope.$on("startQuery", function(event, data){
    $scope.form = data;
  });

  $scope.form = {};
});

/**
* @controller touch003Controller -
*/
app.controller("touch003Controller", function($scope, models){

  /**
  * Listen to ((Display)) event from condition form.
  * Update recreive condition to $scope.form.
  */
  $scope.$on("startQuery", function(event, data){
    $scope.form = data;
  });

  /**
  * Scrop variable.
  */
  $scope.form = {};
});
