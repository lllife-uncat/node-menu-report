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
