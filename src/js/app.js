
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


function Test () {
  this.x = "xx";
  this.y = "yy";
}


