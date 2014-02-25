
var app = angular.module("menuReport", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "views/home.html",
		controller: "homeController"
	});

	$routeProvider.otherwise({
		redirectTo : "/"
	});
});




app.factory("collectionService", function () {

    var queryType = {
        daily : "Daily",
        monthly : "Monthly",
        yearly : "Yearly"
    };

    function QueryInfo() {
        this.queryType = queryType.daily;

        // Daily
        this.dailyMonth = 0;
        this.dailyYear = 0;

        // Monthly
        this.monthlyFrom = 0;
        this.monthlyTo = 0;

        // Yearly
        this.yearlyFrom = 0;
        this.yearlyTo = 0;

        // All type
        this.timeFrom = 0;
        this.timeTo = 0;

        Object.preventExtensions(this);
    };

    function Property(key, value) {
        this.key = key;
        this.value = value;
    }

    var timeList = [];
    var monthList = [];
    var yearList = [];

    for(var i = 0 ; i< 24; i++){
        var value = (i+1).toString();

        var time = new Property(i, ("00" + value + ".00").substring(value.length));
        timeList.push(time);
    }

    for(var i = 0; i< 12; i++){
        var text = moment(new Date(2012, i, 10)).format("MMMM");
        var month = new Property(i,text);
        monthList.push(month);
    }

    for(var i = 2013; i < 2016; i++){
        var year = new Property(i, i.toString());
        yearList.push(year);
    }

    return {
        yearList : yearList,
        monthList : monthList,
        timeList : timeList,
        QueryInfo : QueryInfo,
        queryType : queryType
    }
});
app.controller("homeController", function ($scope, collectionService, $log) {

    function initDropdown() {
        var d = new DropdownId();
        resetDropdown(d.dailyMonth);
        resetDropdown(d.dailyYear);
        resetDropdown(d.monthlyFrom);
        resetDropdown(d.monthlyTo);
        resetDropdown(d.yearlyFrom);
        resetDropdown(d.yearlyTo);
        resetDropdown(d.timeFrom);
        resetDropdown(d.timeTo);
    }

    function getDropdownValue(id) {
        var value = $(id).dropdown("get value");
        return value;
    }

    function resetDropdown(id) {
        $(id).dropdown();

        setDropdown(id, -1, "ทั้งหมด");
    }

    function setDropdown(id, key, value) {
        $(id).dropdown("set value", key).dropdown("set text", value)
    };

    // Collection of dropdown id
    // * Use as object with keyword "new"
    function DropdownId() {
        this.dailyMonth = "#dailyMonth";
        this.dailyYear = "#dailyYear";

        this.monthlyFrom = "#monthlyFrom";
        this.monthlyTo = "#monthlyTo";

        this.yearlyFrom = "#yearlyFrom";
        this.yearlyTo = "#yearlyTo";

        this.timeFrom = "#timeFrom";
        this.timeTo = "#timeTo";
    };

    angular.element(document).ready(function () {

//		$(".main").onepage_scroll({
//		   sectionContainer: "section",
//		   easing: "ease",
//		   animationTime: 1000,
//		   pagination: true,
//		   updateURL: false,
//		   beforeMove: function(index) {},
//		   afterMove: function(index) {},
//		   loop: false,
//		   keyboard: true,
//		   responsiveFallback: false
//		});

        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        }

        function initChart() {
            var ctx = $("#chart").get(0).getContext("2d");
            new Chart(ctx).Bar(data);
        }

        setTimeout(initChart, 100);
        setTimeout(initDropdown, 100);
    });

    $scope.months = collectionService.monthList;
    $scope.years = collectionService.yearList;
    $scope.times = collectionService.timeList;
    $scope.currentQuery = new collectionService.QueryInfo();
    $scope.queryType = collectionService.queryType;

    $scope.selectQueryType = function(type){
       $scope.currentQuery.queryType = type;
    };

    $scope.isSelected = function(type){
        return type === $scope.currentQuery.queryType;
    }

    $scope.startQuery = function () {

        // Borrow currentQuery instance...
        var q = $scope.currentQuery;

        var d = new DropdownId();

        q.dailyMonth = getDropdownValue(d.dailyMonth);
        q.dailyYear = getDropdownValue(d.dailyYear);

        q.monthlyFrom = getDropdownValue(d.monthlyFrom);
        q.monthlyTo = getDropdownValue(d.monthlyTo);

        q.yearlyFrom = getDropdownValue(d.yearlyFrom);
        q.yearlyTo = getDropdownValue(d.yearlyTo);

        q.timeFrom = getDropdownValue(d.timeFrom);
        q.timeTo = getDropdownValue(d.timeTo);

        console.log(q);

    };

    $scope.clear = function () {
        initDropdown();
    };
});
app.controller("mainController", function($scope){
	
});