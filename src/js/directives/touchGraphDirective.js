app.directive("touchGraph", function(){

  /**
  * Function renderGraph().
  * @param {Object} graph - Input datas.
  * @api {Private}
  */
  function renderGraph(graph) {

    var options = {
      scaleLabel : "<%=value%>",
      scaleOverlay : true,
      scaleShowLabels : true
    };

    var data = {
      labels: graph.columns,
      datasets: [
        {
          fillColor: "rgba(220,220,220,0.8)",
          strokeColor: "rgba(220,220,220,1)",
          data: graph.values
        }
      ]
    };

    var ctx = $("#chart").get(0).getContext("2d");
    var chart = new Chart(ctx).Bar(data, options);
  }

  /**
  * Function controller().
  * @param {Object} $scope - Angular auto inject $scope.
  * @api {Private}
  */
  function controller($scope) {
    $scope.$on("displayGraph", function(event, datas){
      var graph = $scope.graph;
      graph.values = datas.values;
      graph.columns = datas.columns;
      graph.datas = datas.datas;
      renderGraph(graph);
    });

    $scope.graph = {};
  }

  /**
  * Function link().
  * @api {Private}
  */
  function link() { }

  /**
  * Return directive object.
  */
  return {
    restrict: "E",
    controller: controller,
    link: link,
    templateUrl: "/views/directives/touchGraphDirective.html"
  }

});
