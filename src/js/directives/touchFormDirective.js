app.directive("touchForm", function(models, globalService){

  function controller($scope, models) {
    $scope.form = new models.TouchCondition({reportType: "Dialy"});
    $scope.type = "Daily";

    $scope.setType = function(type) {
       $scope.type = type;
    };

    $scope.isSet = function(type) {
      return $scope.type === type;
    };

    globalService.findAllBranch(function(data){
      $scope.form.branchs = data;
    });

  }

  function link(scope, el, attr) {

    console.log(scope.form.months);

  }

  return {
    restrict: "E",
    controller: controller,
    templateUrl: "/views/directives/touchFormDirective.html",
    link: link
  };
});
