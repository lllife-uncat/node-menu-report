/**
* @controller touch001Controller -
*/
app.controller("touch001Controller", function($scope, models, $rootScope, dbService){

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
  * Cloable log.
  */
  function konsole() {
    return {
      log: function(message){
        //console.log(message);
      }
    }
  }

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, data){

    var console = konsole();

    // Extract category A id..
    var la = data.categoryA._id;
    if(la == 0) la = null;

    // Write log...
    console.log("::query");
    console.log(data);

    // Parse query.
    var query = models.parseQuery(data);

    var collectionIndexs = [];
    var collectionDatas = [];

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(data){

      // Find all category A
      // Get only top lavel category.
      dbService.findAllCategoryByExample( { parentId: null }, function(levelAs){
        var levelAIds = _.map(levelAs, function(x){ return x._id; });
        if(la != null) {
          levelAIds = _.filter(levelAIds, function(x){ return x === la});
        }

        // Write log...
        console.log("::LEV-A");
        console.log(levelAIds);

        // Find all category B
        dbService.findAllCategoryByExample( { parentId: { $in: levelAIds }}, function(levelBs){

          // Flatten level 'B' id as array of string.
          var levelBIds = _.map(levelBs, function(x){ return x._id; });

          // Assign all level 'B' as collection index.
          collectionIndexs = levelBs;

          // Write log...
          console.log("::LEV-B");
          console.log(levelBIds);

          // Find all category C
          dbService.findAllCategoryByExample({ parentId: { $in: levelBIds }}, function(levelCs){
            var levelCIds = _.map(levelCs,  function(x) { return x._id; });

            // Write log...
            console.log("::LEV-C");
            console.log(levelCIds);

            // Find all products.
            dbService.findAllProductByExample({ categoryIds: { $in: levelCIds }}, function(products){

              // Write log...
              console.log("::PRODUCT");
              console.log(products);
            });
          });
        });
      });

      $rootScope.$broadcast("displayGraph", data);
      $rootScope.$broadcast("displayTable", data);
    });

  });

});
