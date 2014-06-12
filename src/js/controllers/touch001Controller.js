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

