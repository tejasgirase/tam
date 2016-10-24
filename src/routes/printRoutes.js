var express = require("express"),
		printRouter = express.Router();
var printController = require("../controller/printController")();

printRouter.route("/appointment").get(printController.printAppointment);
module.exports = printRouter;