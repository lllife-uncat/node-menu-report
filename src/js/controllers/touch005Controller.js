
/**
* @controller touch003Controller -
*/
app.controller("touch005Controller", function($scope, models, $rootScope, dbService){

  var allProducts = [];

  /**
  * Find all category C.
  * Keep reference on $scope.allCategoriesC.
  */
  dbService.findAllCategoryByExample({ delete: false}, function(data){
    $scope.categories = data;
    var aa = _.filter(data, function(x){ return x.parentId == null; });
    var aaids = _.map(aa, function(x){ return x._id; });
    var bb = _.filter(data, function(x) { return aaids.indexOf(x.parentId) != -1; });
    var bbids = _.map(bb, function(x) { return x._id; });
    var cc = _.filter(data, function(x){ return bbids.indexOf(x.parentId) != -1;});
    $scope.allCategoriesC = cc;
  });

  /*
  * Find all prodcuts.
  * Keep reference on $scope.products && allProducts.
  */
  dbService.findAllProductByExample({delete: false}, function(data){
    $scope.products = data;
    allProducts = data;
  });

  /**
  * Scrop variable.
  */
  $scope.categoriesC = [];
  $scope.categories = [];
  $scope.products = [];
  $scope.allCategoriesC = [];

  /**
  * Start query.
  * Trigger when user click ((display)) button.
  */
  $scope.$on("startQuery", function(event, form){

    /**
    * Parse form data as specific query (can understand by server).
    */
    var query = models.parseQuery(form);
    var levelBId= form.categoryB._id;
    if(levelBId){
      var all = $scope.categories;
      var nbs = _.filter(all, function(x){ return x.parentId === levelBId; });
      $scope.categoriesC = nbs;
    }else {
      $scope.categoriesC = $scope.allCategoriesC;
    }

    /**
    * Start rest api request.
    * Endpoint - /report/touch001
    * Return - List of touch information.
    */
    dbService.post("/report/touch001", query, function(record){

      var columnIds = [];

      /**
      * Get column summary.
      * @param {String} column - Column value use as query key.
      * @return {Number} - Caculation result.
      */
      function getBranchSum(column) {
        var columnDatas= record.datas[column];
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
        var columnDatas = record.datas[column];
        var rows = [];

        if(!columnDatas) return 0;

        var matchs = _.filter(columnDatas, function(x){
          var product = columnIds[$index];
          return product == x.objectId;
        });

        return matchs.length;
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
        record.rows = columns;
        record.getBranchRecord = getBranchRecord;
        record.getBranchSum = getBranchSum;
        $rootScope.$broadcast("displayTable", record);
      }

      /**
      * Transform original data into prefer format.
      */
      function getProducts() {
        var products = _.filter(form.products, function(x) { return typeof(x._id) != "undefined"; });
        var finals = [];

        if(form.categoryC._id) {
          finals = _.filter(products, function(x) { return x.categoryIds.indexOf(form.categoryC._id) != -1; });
        }else {
          finals = allProducts;
        }

        return finals;
      }

      /**
      * Create rows....
      */
      function createRowAndValue() {
        var products = getProducts();
        var idx = 1;
        var columns =  _.map(products, function(x) { return  (idx++) + ". " + x.name; });
        var columnIds = _.map(products, function(x) { return x._id; });
        var values = [];

        var index = 0;
        columnIds.forEach(function(column){
          var length = 1;
          record.datas.forEach(function(touchs){
            touchs.forEach(function(touch){
              var match = touch.objectId === column;
              if(match) length ++;
            });
          });

          values[index++] = length;
        });

        return {
          columns: columns,
          values: values,
          columnIds: columnIds
        };
      };

      /**
      * Render grap and table here.
      */
      var rv = createRowAndValue();
      columnIds = rv.columnIds;
      showGraph(rv.columns, rv.values);
      showTable(rv.columns, rv.values);

    });
  });
});
