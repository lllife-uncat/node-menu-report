app.controller("touch006Controller", function($scope, dbService, models, $rootScope){

  var allProducts = [];

  /**
  * Find category and all category 'C'.
  * Load immediately.
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

  /**
  * Find all products in database via web service.
  * Load immediately.
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
    * If category B was selected, filter only category under B.
    * Otherwise use all category in level C.
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

      function sortTouch(counts) {
        var sortable = [];
        for(var key in counts) {
          sortable.push([key, counts[key]]);
        }
        sortable.sort(function(a,b){ return b[1] - a[1] });
        return sortable;
      }

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

        var counts = _.countBy(columnDatas, function(x) { return x.objectId; });
        var sortable = sortTouch(counts);
        var topN = sortable[$index];
        if(topN) {
          var productId = topN[0];
          var product = _.find(getProducts(), { _id: productId});
          return product.name;
        }
        return "N/A";
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
      * Function getProduct()
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
      * Function createRowAndValue()
      * Create rows and values.
      */
      function  createRowAndValue() {

        var columns = [],
            columnIds =[],
            values = [],
            touchs =[],
            products = getProducts();

        for(var key in record.datas){
          var v = record.datas[key];
          touchs.push.apply(touchs, v);
        }

        var counts = _.countBy(touchs, function(x){ return x.objectId; });
        var sortable = sortTouch(counts);

        for(var key in sortable){
          var vs = sortable[key];
          var productId = vs[0];
          var count = vs[1];
          var product = _.find(products, { _id: productId });

          var columnName = product.name;
          columns.push(columnName);
          columnIds.push(productId);
          values.push(count);
        }

        return {
          columns: columns,
          values: values,
          columnIds: columnIds
        }
      }

      /**
      * Render to screen.
      */
      var rv = createRowAndValue();
      var columns = rv.columns.slice(0,10);
      var values = rv.values.slice(0,10);
      columnIds = rv.columnIds.slice(0,10);

      showGraph(columns, values);
      showTable(columns, values);

    });
  });
});
