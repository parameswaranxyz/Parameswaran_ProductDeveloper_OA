const shipmentModule = require('../modules/shipmentModule');
const {responseWithStatus} = require("./controllerHelper");

const getShipmentData = async (req, res) => { 
    try {        
        let result = await shipmentModule.getData();
        return responseWithStatus(res, result);
    } catch (error) {        
        return responseWithStatus(res, {"Error":"ERROR IN API"}, 503);        
    }   
}

module.exports = {
    getShipmentData
}
