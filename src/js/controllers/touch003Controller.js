app.controller("touch003Controller", function($scope, models){

  /**
  * Listen to ((Display)) event from condition form.
  * Update recreive condition to $scope.form.
  */
  $scope.$on("startQuery", function(env, data){
    console.log(":: start query");
    console.log(data);

    $scope.form = data;
  });


  /**
  * Scrop variable.
  */
  $scope.form = {};

});
