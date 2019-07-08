const shipmentRouter = require('./shipmentRouter');
const circleConfigRouter = require('./circleConfigRouter');

const mainRouter = app => {    
    app.use('/', shipmentRouter);
    app.use('/config', circleConfigRouter);
}

module.exports = mainRouter
