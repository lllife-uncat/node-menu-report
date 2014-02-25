
app.factory("globalService", function($http, $log, configService){

    var endPoint = configService.endPoint;

    function findAllCategory(callback){
        var url = endPoint + "/category";
        var request = $http({
            url : url,
            method: "GET"
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    function findAllProduct(callback){
        var url = endPoint + "/product";
        var request = $http({
           url : url,
           method : "GET"
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    function findAllBranch(callback) {
        var url = endPoint + "/branch";
        var request = $http({
            url : url,
            method : "GET"
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    return {
        findAllProduct : findAllProduct,
        findAllCategory : findAllCategory,
        findAllBranch : findAllBranch
    };
});