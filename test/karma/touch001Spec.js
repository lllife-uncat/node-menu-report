/**
* Test controller 001.
*/
describe("Touch 001 Controller...", function(){
  var scope, httpBackend;
  beforeEach(angular.mock.module("menuReport"));
  beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_){
    httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    $controller("touch001Controller", { $scope: scope});
  }));

  it("Should have variable message = 'Hello message'", function(){
    expect(scope.message).toBe("Hello message");
  });
});

/**
* Test controller 003.
*/
describe("Touch 003 Controller...", function(){

  var scope, httpBackend;

  beforeEach(angular.mock.module("menuReport"));
  beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_){
    scope = $rootScope.$new();
    $controller("touch003Controller", { $scope: scope});

    httpBackend = _$httpBackend_;
    httpBackend.whenPOST("/api/category/query").respond({ title: "Test"});
    httpBackend.whenPOST("/api/product/query").respond({ name: "Hello"});
    httpBackend.flush();

  }));

  it("'B' should not emplty", function(){
      expect(scope.categoriesB.length).not.toEqual(0);
  });

  it("Products should not empty", function(){
      expect(scope.products.length).not.toEqual(0);
  });

  it("Categories should not empty", function(){
      expect(scope.categories.length).not.toEqual(0);
  });
});
