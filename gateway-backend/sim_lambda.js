var r = require("ts-node").register();
var { handler } = require("./src/index");
var { SimulateLamdba } = require("aws-lambda-helper");

SimulateLamdba.run(8282, handler);
console.log("running on 8282....");
