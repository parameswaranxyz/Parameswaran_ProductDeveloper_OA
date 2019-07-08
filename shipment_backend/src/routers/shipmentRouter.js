const shipmentRouter = require('express').Router();
const shipmentController = require('../controller/shipmentController');

shipmentRouter.get('/', shipmentController.getShipmentData);

module.exports = shipmentRouter;