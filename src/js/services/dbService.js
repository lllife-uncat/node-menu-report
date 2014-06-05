/**
* Database service.
*/
app.factory("dbService", function($http){

  /**
  * Request get api.
  * @param {String} url.
  * @param {Function} callback.
  * @api {Private}
  */
  function get(url, callback) {
     var req =  $http({
      method: "GET",
      url: url
    });

    req.success(function(data){
      callback(data);
    });

    req.error(function(err){
      $scope.$emit("error", err);
      console.log(err);
    });
  }

  /**
  * Function post()
  * @param {String} url - Request url.
  * @param {Object} data - Post data.
  * @param {Function} callback - Request callback.
  * @api {Public}
  */
  function post(url, data, callback){
    var req = $http({
      method: "POST",
      url: url,
      data: JSON.stringify(data),
      header: { "Content-Type": "application/json" }
    });

    req.success(function(data){
      callback(data);
    });

    req.error(function(err){
      console.log(err);
    });
  }

  /**
  * Request product by example.
  * @param {Object} example - Conditions.
  * @param {Function} callback - Request callback.
  * @api {Public}
  */
  function findAllProductByExample(example, callback) {
    post("/api/product/query", example, callback);
  }

  /**
  * Request category by example.
  * @param {Object} example - Conditions.
  * @param {Function} callback - Request callback.
  * @api {Public}
  */
  function findAllCategoryByExample(example, callback) {
    post("/api/category/query", example, callback);
  }

  /**
  * Request all device information.
  * @param {Function} callback.$
  * @api {Public}
  */
  function findAllDevice(callback){
    get("/api/device", callback);
  }

  /**
  * Request all branchs.
  * @param {Function} callback.
  * @api {Public}
  */
  function findAllBranch(callback){
    get("/api/branch", callback);
  }

  /**
  * Request all products.
  * @param {Function} callback.
  * @api {Public}
  */
  function findAllProduct(callback) {
    get("/api/product", callback);
  }

  /**
  * Export all public function here.
  */
  return {
    findAllProductByExample: findAllProductByExample,
    findAllCategoryByExample: findAllCategoryByExample,
    findAllBranch: findAllBranch,
    findAllDevice: findAllDevice,
    post: post,
    get: get
  };
});
