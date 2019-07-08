const circleConfigModule = require("../modules/circleConfigModule");
const {responseWithStatus} = require("./controllerHelper");

const uploadData = async (req, res) => {
    try {        
        let result = await circleConfigModule.upload(req.body);        
        return responseWithStatus(res, {"response": result});
    } catch (error) {        
        return responseWithStatus(res, {"Error":"ERROR IN API"}, 503);    
    }
}

module.exports = {
    uploadData
}
