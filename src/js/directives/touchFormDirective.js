app.directive("touchForm", function(models, dbService){

  /**
  * Directive :controller definition.
  */
  function controller($scope) {

    dbService.findAllBranch(function(data){
      $scope.form.branchs = data;
    });

    /**
    * Init query condition.
    * Default report type is "Daily".
    */
    $scope.form = new models.TouchCondition();
    $scope.form.reportType = "Daily";

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
    controller: controller,
    templateUrl: "/views/directives/touchFormDirective.html",
    link: link
  };
});
