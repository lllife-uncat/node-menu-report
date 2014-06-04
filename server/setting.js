/**
* Config object.
* @property {String} mongo connection string.
*/

var uri = "localhost:27017";
var databaseName = "TestEMenuSystems";

var config = {
  connectionString : uri + "/" + databaseName,
  databaseUri :  uri,
  databaseName: databaseName
}

/**
* Export all config.
*/
module.exports = config;
