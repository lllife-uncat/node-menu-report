app.controller("touch001Controller", function($scope, models){
  $scope.$on("startQuery", function(event, data){
    console.log(":: start 001 query");
    console.log(data);
    $scope.form = data;
  });

  $scope.form = {};
});


app.controller("touch002Controller", function($scope, models){
  $scope.$on("startQuery", function(event, data){
    console.log("::start 002 query");
    console.log(data);
    $scope.form = data;
  });

  $scope.form = {};
});

app.controller("touch003Controller", function($scope, models){

  /**
  * Listen to ((Display)) event from condition form.
  * Update recreive condition to $scope.form.
  */
  $scope.$on("startQuery", function(event, data){
    console.log(":: start query");
    console.log(data);

    $scope.form = data;
  });

  /**
  * Scrop variable.
  */
  $scope.form = {};

});
