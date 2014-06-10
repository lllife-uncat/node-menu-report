var app = angular.module("menuReport", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "views/home.html",
		controller: "homeController"
	});

  $routeProvider.when("/touch/001", {
    templateUrl: "views/touches/touch001.html",
    controller: "touch001Controller"
  });

  $routeProvider.when("/touch/002", {
    templateUrl: "views/touches/touch002.html",
    controller: "touch002Controller"
  });

  $routeProvider.when("/touch/003", {
    templateUrl: "views/touches/touch003.html",
    controller: "touch003Controller"
  });

  $routeProvider.when("/touch/004", {
    templateUrl: "views/touches/touch004.html",
    controller: "touch004Controller"
  });

  $routeProvider.when("/touch/005",{
    templateUrl: "views/touches/touch005.html",
    controller: "touch005Controller"
  });

  $routeProvider.when("/touch/006",{
    templateUrl: "views/touches/touch006.html",
    controller: "touch006Controller"
  });

	$routeProvider.otherwise({
		redirectTo : "/"
	});

  var x = {
    k: 300,
    n: 500,
    z: 800
  };
});


/**
* Override console object.
*/
(function(window){
  var konsole = window.console;
  window.console = {
    log: function(msg) {
      konsole.log(msg);
    },
    error:function(msg){
      konsole.error(msg);
    }
  };
});
