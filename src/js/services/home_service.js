

app.factory("homeService", function($http, configService, $log){
    var endPoint = configService.endPoint;

    function queryCoarseCompare(queryInfo, callback){
        var request = $http({
            url : endPoint + "/report/compare/coarse",
            method : "POST",
            data : JSON.stringify(queryInfo),
            headers : { "Content-Type" : "multipart/form-data" }
        });

        request.success(function(data){
            callback(data);
        });

        request.error(function(err){
            $log.error(err)
        });
    }

    return {
        queryCoarseCompare : queryCoarseCompare
    };
});