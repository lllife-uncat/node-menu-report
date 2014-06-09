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
      var all = new collections.Property(0, "All");
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
    * Append 'All' as default category title.
    */
    function appendDefaultCategory(categories) {
      categories.unshift({ title: "All", _id: 0 });
    }

    /**
    * Prepend 'Alll' as default product title.
    */
    function appendDefaultProduct(products){
      products.unshift({ name: "All"});
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
    * Init branchs.
    */
    dbService.findAllBranch(function(data){
      appendDefaultBranch(data);
      $scope.form.branchs = data;
      $scope.form.branch = data[0];
    });

    /**
    * Init products.
    */
    dbService.findAllDevice(function(data){
      appendDefaultDevice(data);
      $scope.form.devices = data;
      $scope.form.device = data[0];
    });

    /**
    * Init level 'A' category.
    */
    dbService.findAllCategoryByExample( { parentId: null }, function(data){
      var form = $scope.form;
      appendDefaultCategory(data);
      form.categoriesA = data;
      form.categoryA = data[0];
    });

    /**
    * Init query condition.
    * Default report type is "Daily".
    */
    $scope.form = createQueryCondition();

    /**
    * Assign default form values.
    */
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
    * Function changeCategory().
    * @param {String} category - Category level ('A', 'B' or 'C').
    * @api {Public}
    */
    $scope.changeCategory = function(cat) {
      var form = $scope.form;
      if(cat === "A") {
        // Reset category B...
        var a = form.categoryA;
        dbService.findAllCategoryByExample( { parentId: a._id }, function(data){
          appendDefaultCategory(data);
          form.categoriesB = data;
          form.categoryB = data[0];
        });
      }else if(cat === "B") {
        // Reset category C...
        var b = form.categoryB;
        dbService.findAllCategoryByExample( { parentId: b._id }, function(data){
          appendDefaultCategory(data);
          form.categoriesC = data;
          form.categoryC = data[0];
        });
      }else if(cat === "C") {
        // Reset product.
        var c = form.categoryC;
        var cons = {
          categoryIds: { $all : [c._id] }
        };

        dbService.findAllProductByExample(cons,  function(data){
          appendDefaultProduct(data);
          form.products = data;
          form.product = data[0];

          console.log(form.products);
        });
      }
    };

    $scope.show = function(cat) {
      var set = $scope.isCategorySet;
      var rs = false;
      if(cat === "A")  {
        rs = $scope.showCategoryA;
      }
      else if(cat === "B") {
        rs = set("A") && $scope.showCategoryB;
      }
      else if(cat === "C") {
        rs = set("A") && set("B") && $scope.showCategoryC;
      }
      else if(cat === "P") {
        rs = set("A") && set("B") && set("C") && $scope.showProduct;
      }

      return rs;
    };

    /**
    * Is specific category valid or not.
    * @param {String} c - Category level ('A', 'B' or 'C')
    * @return {Boolean} - Is category ok.
    */
    $scope.isCategorySet = function(c){
      var f = $scope.form;
      if(c === 'A') return f.categoryA._id !== 0;
      else if(c === 'B') return f.categoryB._id !== 0;
      else if(c === 'C') return f.categoryC._id !== 0;
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
      console.log($scope.form);
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
    scope: {
      showCategoryA: "=",
      showCategoryB: '=',
      showCategoryC: '='
    },
    controller: controller,
    templateUrl: "/views/directives/touchFormDirective.html",
    link: link
  };
});
