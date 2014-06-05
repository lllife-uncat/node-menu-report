var query = require("../server/query");
var mongojs = require("mongojs");
var connection = require("../server/setting").connectionString;
var db = mongojs(connection);
var q =  query(db);
var _ = require("lodash");

describe("[Test Data]", function(){

  function createDevice() {

  }

  function random(max) {
    return Math.floor(Math.random() * max);
  }

  function createTouch(product) {
    var date = new Date(2014, 10, 30);
    var touch = {
      collectionDate: date,
      touchDate: date,
      objectType: "Product",
      objectId: product._id.toString(),
      deviceId: "DEV003",
      year: date.getFullYear(),
      //month: date.getMonth(),
      //date: date.getDate(),
      month: random(12),
      date: random(30),
      hour: date.getHours() + random(24)
    };
    return touch;
  }

  function createProduct() {
    var product = {
      name: "Test 001",
      model: "M001",
    };
    return product;
  }

  it("Should generate test info successful.", function(done){

    var product = createProduct();
    q.save("MenuProductInfo", product, function(err, p){
      var range = _.range(0, 100);
      range.forEach(function(r){

        var touch = createTouch(p);
        q.save("MenuTouchInfo", touch, function(err, doc){
          console.log(doc);
        });

      });

      //done();
    });
  });
});
