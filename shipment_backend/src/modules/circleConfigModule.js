const circleData = require("../Data/circleConfigDetails");

const upload = async(config) => {    
    return await circleData.upload(config);
}

module.exports = {
    upload    
}
