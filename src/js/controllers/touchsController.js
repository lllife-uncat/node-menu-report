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
        console.log(message);
      }
    }
  }

  /**
  * Find all category B in database.
  * Keep reference on $scope.categoriesB.
  */
  dbService.findAllCategoryByExample({ delete: false}, function(cats){
    var categoriesA = _.filter(cats, function(x){ return x.parentId === undefined;});
    var ids = _.map(categoriesA, function(x) { return x._id; });
    var categoriesB = _.filter(cats, function(x){ return ids.indexOf(x.parentId) != -1; });

    $scope.categories = cats;
    $scope.categoriesB = categoriesB;
    $scope.allCategoriesB = categoriesB;
  });

  dbService.findAllProductByExample({}, function(products){
    $scope.products = products;
  });

  /**
  * Scrop variable.
  */
  $scope.categoriesB = [];
  $scope.categories = [];
  $scope.products = [];
  $scope.allCategoriesB = [];


  /**
  * Check is product is under specific category.
  * @param {String} productId.
  * @param {String} categoryId.
  * @return {Boolean}.
  */
  $scope.isInCategoryB = function(productId, categoryId) {
    var all = $scope.categories;
    var products = $scope.products;
    var product = _.filter(products, function(x) { return x._id == productId })[0];

    //console.log(">> product <<");
    //console.log(productId);
    //console.log(categoryId);

    if(!product) return false;

    var c = _.filter(all, function(x) { return product.categoryIds.indexOf(x._id) != -1; })[0];
    var b = _.filter(all, function(x) { return c.parentId == x._id; })[0];
    return b._id == categoryId;
  };

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, data){

    /**
    * Parse form data as specific query (can understand by server).
    */
    var query = models.parseQuery(data);
    var levelAId= data.categoryA._id;
    if(levelAId){
      var all = $scope.categories;
      var nbs = _.filter(all, function(x){ return x.parentId === levelAId; });
      $scope.categoriesB = nbs;
    }else {
      $scope.categoriesB = $scope.allCategoriesB;
    }

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(data){

      var columns =  _.map($scope.categoriesB, function(x) { return x.title; });
      var columnIds = _.map($scope.categoriesB, function(x) { return x._id; });
      var values = [];


      var index = 0;
      columnIds.forEach(function(column){
        var length = 1;
        data.datas.forEach(function(touchs){
          touchs.forEach(function(touch){
            var match = $scope.isInCategoryB(touch.objectId, column);
            if(match) length ++;
          });
        });

        values[index++] = length;
      });

      var graph = {
        columns: columns,
        values: values
      };

      $rootScope.$broadcast("displayGraph", graph);
      $rootScope.$broadcast("displayTable", data);

    });
  });
});
