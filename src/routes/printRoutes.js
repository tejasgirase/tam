var express = require("express"),
		printRouter = express.Router();
var printController = require("../controller/printController")();
console.log("Routes enter");
printRouter.route("/appointment").get(printController.printAppointment);
printRouter.route("/medications").get(printController.printMedication);
module.exports = printRouter;