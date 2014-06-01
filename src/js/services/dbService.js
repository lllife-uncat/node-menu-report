app.factory("dbService", function($http){
  function findAllBranch(callback){
    var req =  $http({
      method: "GET",
      url: "/api/branch"
    });

    req.success(function(data){
      callback(data);
    });

    req.error(function(err){
      console.log(err);
    });
  }

  return {
    findAllBranch: findAllBranch
  };
});
