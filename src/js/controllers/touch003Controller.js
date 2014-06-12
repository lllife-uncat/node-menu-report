/**
* @controller touch003Controller -
*/
app.controller("touch003Controller", function($scope, models, $rootScope, dbService){

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

  dbService.findAllProductByExample({delete:false, archive:false}, function(products){
    $scope.products = products;
  });

  /**
  * Scrop variables.
  * @variable {Array} categoriesB - Current category B.
  * @variable {Array} categories - All categories.
  * @variable {Array} allCategoriesB
  * @variable {Array} product
  */
  $scope.categoriesB = [];
  $scope.categories = [];
  $scope.allCategoriesB = [];
  $scope.products = [];

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

    if(!product) return false;

    var c = _.filter(all, function(x) { return product.categoryIds.indexOf(x._id) != -1; })[0];
    var b = _.filter(all, function(x) { return c.parentId == x._id; })[0];
    return b._id == categoryId;
  };

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, form){

    /**
    * Parse form data as specific query (can understand by server).
    */
    var query = models.parseQuery(form);
    var levelAId= form.categoryA._id;
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


      var columnIds = [];

      /**
      * Get column summary.
      * @param {String} column - Column value use as query key.
      * @return {Number} - Caculation result.
      */
      function getBranchSum(column) {
        var columnDatas= data.datas[column];
        if(!columnDatas) return 0;
        return columnDatas.length;
      }

      /**
      * Get element value.
      * Value compose from column and row.
      * @param {String} column - Column value.
      * @param {Number} $index - Row index.
      * @return {Number} - Caculation result.
      */
      function getBranchRecord(column, $index) {

        var columnDatas = data.datas[column];
        var rows = [];

        if(!columnDatas) return 0;

        var rs = 0;
        columnDatas.forEach(function(el){
          var catB = columnIds[$index];
          var ok = $scope.isInCategoryB(el.objectId, catB);
          if(ok) rs ++;
        });

        return rs;
      }

      /**
      * showGraph()
      * @param {Array} columns - Columns to render.
      * @param {Value} values - Graph values.
      */
      function showGraph(columns, values) {
        var graph = {
          columns: columns,
          values: values
        };

        $rootScope.$broadcast("displayGraph", graph);
      }

      /**
      * Function showTable()
      * Pass addition info into directive template.
      */
      function showTable(columns, values) {
        data.rows = columns;
        data.getBranchRecord = getBranchRecord;
        data.getBranchSum = getBranchSum;
        $rootScope.$broadcast("displayTable", data);
      }

      function createRowAndValue() {
        /**
      * Transform original data into prefer format.
      */
        var columns =  _.map($scope.categoriesB, function(x) { return x.title; });
        var columnIds = _.map($scope.categoriesB, function(x) { return x._id; });
        var values = [];

        /**
      * Create graph values.
      */
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

        return {
          values: values,
          columns: columns,
          columnIds: columnIds
        };
      }

      /**
      * Render to screen.
      */
      var rv = createRowAndValue();
      columnIds = rv.columnIds;
      showGraph(rv.columns, rv.values);
      showTable(rv.columns, rv.values);

    });
  });
});
