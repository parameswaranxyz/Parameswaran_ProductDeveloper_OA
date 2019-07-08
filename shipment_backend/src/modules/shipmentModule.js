const shipmentData = require("../Data/shipmentDetails");

const getData = async() => {
    return await shipmentData.getShipmentDetails();    
}

module.exports = {
    getData
}
