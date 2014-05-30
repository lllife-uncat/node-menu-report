var app = angular.module("menuReport", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "views/home.html",
		controller: "homeController"
	});

  $routeProvider.when("/touch/003", {
    templateUrl: "views/touches/touch003.html",
    controller: "touch003Controller"
  });

	$routeProvider.otherwise({
		redirectTo : "/"
	});

});

function Test () {
  this.x = "xx";
  this.y = "yy";
}
