const circleConfigRouter = require('express').Router();
const circleConfigController = require('../controller/circleConfigController');

circleConfigRouter.post('/', circleConfigController.uploadData);

module.exports = circleConfigRouter;