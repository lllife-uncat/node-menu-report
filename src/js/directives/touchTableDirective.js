app.directive("touchTable", function(){

  function controller($scope, dbService) {
    dbService.findAllDevice(function(data){
      $scope.devices = data;
    });

    $scope.getRecord = function(deviceId, columnIndex) {
      var records = $scope.records;
      var record = records.datas[columnIndex];
      var rs = _.filter(record, function(r) { return r.deviceId === deviceId });
      return rs.length;
    };

    $scope.getSum = function($index) {
      var rs = $scope.records.datas[$index].length;
      return rs;
    };

    $scope.$on("displayTable", function(event, data){
      var records = $scope.records = data;
      window.records = records;
    });

    $scope.datas = {};
    $scope.devices = [];
  }

  function link() {  }

  return {
    restrict: "E",
    controller: controller,
    link: link,
    templateUrl: "/views/directives/touchTableDirective.html"
  };
});
