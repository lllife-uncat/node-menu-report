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
    findAllBranch: findAllBranch,
    findAllDevice: findAllDevice
  };
});
