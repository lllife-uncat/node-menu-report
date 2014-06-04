app.directive("touchForm", function(models, collections, dbService){

  /**
  * Directive :controller definition.
  */
  function controller($scope) {

    /**
    * Append 'All' text into dropdwon list.
    * @param {Array} items - Input array.
    */
    function appendAll(items) {
      var all = new collections.Property(-1, "All");
      items.unshift(all);
    }

    /**
    * Append 'All' into branch dropdown.
    */
    function appendDefaultBranch(branchs) {
      branchs.unshift({name: "All"});
    }

    /**
    * Append 'All' into device dropdown.
    */
    function appendDefaultDevice(devices) {
      devices.unshift({deviceId: "All"});
    }

    /**
    * Function createQueryCondition().
    * return {Object} - New instance of TouchCondition with default value.
    */
    function createQueryCondition() {
      var form = new models.TouchCondition();
      form.reportType = "Daily";
      return form;
    }

    /**
    * Start initilize controller variables here.
    */
    dbService.findAllBranch(function(data){
      appendDefaultBranch(data);
      $scope.form.branchs = data;
      $scope.form.branch = data[0];
    });

    dbService.findAllDevice(function(data){
      appendDefaultDevice(data);
      $scope.form.devices = data;
      $scope.form.device = data[0];
    });

    /**
    * Init query condition.
    * Default report type is "Daily".
    */
    $scope.form = createQueryCondition();

    var form = $scope.form;
    form.dailyMonth = form.months[0];
    form.dailyYear = form.years[0];
    form.timeFrom =  form.times[0];
    form.timeTo = form.times[form.times.length-1];
    form.monthlyFrom = form.months[0];
    form.monthlyTo = form.months[form.months.length-1];
    form.yearlyFrom = form.years[0];
    form.yearlyTo = form.years[form.years.length-1];

    /**
    * Is user selected any branch.
    * @return {String} - Null or branch's _id
    */
    $scope.isBranchSet = function() {
      if($scope.form.branch) {
        return $scope.form.branch._id != null;
      }
    };

    /**
    * User select new branch dropdown.
    * We need to reload device up to selected branch.
    */
    $scope.changeBranch = function() {
      var devs = $scope.form.devicesInBranch;

      // Result device dropdowns.
      devs.length = 0;
      appendDefaultDevice(devs);
      $scope.form.device = devs[0];

      var branch = $scope.form.branch;
      var devices = $scope.form.devices;

      if(!branch.deviceIds) return;

      branch.deviceIds.forEach(function(id){
        var dev = _.find(devices, { _id: id});
        if(dev) devs.push(dev);
      });
    }

    /**
    * Set report type. (Dialy, Monthly or Yearly).
    */
    $scope.setType = function(type) {
      $scope.form.reportType = type;
    };

    /**
    * Is current type match given type.
    */
    $scope.isSet = function(type) {
      return $scope.form.reportType === type;
    };

    /**
    * Emit start query event to parent conroller.
    */
    $scope.startQuery = function() {
      $scope.$emit("startQuery", $scope.form);
    };
  }

  /**
  * Directive :link definition.
  */
  function link(scope, el, attr) {

  }

  /**
  * Directive object definition.
  */
  return {
    restrict: "E",
    controller: controller,
    templateUrl: "/views/directives/touchFormDirective.html",
    link: link
  };
});
