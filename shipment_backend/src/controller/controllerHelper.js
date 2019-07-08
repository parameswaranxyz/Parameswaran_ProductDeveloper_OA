const responseWithStatus = 
    (res, responseObject = {}, status = 200) => res.status(status).send(responseObject);

module.exports ={
    responseWithStatus
}