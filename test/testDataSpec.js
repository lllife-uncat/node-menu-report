var query = require("../server/query");
var mongojs = require("mongojs");
var connection = require("../server/setting").connectionString;
var db = mongojs(connection);
var q =  query(db);
var _ = require("lodash");

describe("[Test Data]", function(){

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function random(inputs){
    var index = Math.floor(Math.random() * inputs.length);
    return inputs[index];
  };

  function createTouch(product) {

    var pros = ["53902890e4b07f9142ba0abc", "539028abe4b07f9142ba0abf", "539028e7e4b07f9142ba0ac3"];
    var devs = ["DEV001", "DEV002", "DEV003"];
    var years = [2014, 2015, 2016, 1017, 2018, 1019];

    var date = new Date(2014, 10, 30);
    var touch = {
      collectionDate: date,
      touchDate: date,
      objectType: "Product",
      objectId: random(pros),
      deviceId: random(devs),
      year: random(years),
      month: randomInt(12),
      date: randomInt(30),
      hour: date.getHours() + randomInt(24)
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

    this.timeout(8000);

    var product = createProduct();
    q.save("MenuProductInfo", product, function(err, p){
      var range = _.range(0, 5000);
      range.forEach(function(r){
        var touch = createTouch(p);
        q.save("MenuTouchInfo", touch, function(err, doc){ });
      });

      done();

    });
  });
});
