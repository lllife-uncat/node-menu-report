var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var route = require("./server/route")

var app = express();
var port = 8080;

/**
* Config express application.
* Use /dev as public directory.
*/
app.use(express.static(__dirname + "/dev"));
app.use(morgan("dev"));
app.use(bodyParser());
app.use(methodOverride());
app.listen(port);

/**
* Initial api route.
*/
route.init(app);
console.log("server start @0.0.0.0:" + port);
