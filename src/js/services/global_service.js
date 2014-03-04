
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

    function syncPirs() {
       var url = endPoint + "/pir/sync";
        var request = $http( {
            method: "GET",
            url: url
        });

        request.success(function(data){
            console.log("Sync pirs ok...");
        });

        request.error(function(err){
            console.log("Sync pirs failed...");
        });
    }
    function syncTouchs() {
       var url = endPoint + "/touch/sync";
        var request = $http({
            method : "GET",
            url : url
        });

        request.success(function(data){
            console.log("Sync touchs ok...");
        });

        request.error(function(err){
            console.log("Sync touchs failed...");
        });
    }

    return {
        findAllProduct : findAllProduct,
        findAllCategory : findAllCategory,
        findAllBranch : findAllBranch,
        syncAll : function() {
            syncPirs();
            syncTouchs();
        }
    };
});