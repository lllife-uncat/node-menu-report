app.controller("mainController", function($scope, collections){

    $scope.tab = new collections.SubTab();
    $scope.selectedTab = $scope.tab.click;

    $scope.selectTab = function(tab){
        $scope.selectedTab = tab;
        $scope.$broadcast("changeSubTab", tab);
    }

    $scope.isSelected = function(tab){
        return $scope.selectedTab == tab;
    }

    angular.element(document).ready(function(){
      $(".ko-touch-dropdown").dropdown();
      $(".ko-comparison-dropdown").dropdown();
    });

});
