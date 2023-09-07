const Helper = require('./helper');


function sendSuccessResponse(res, message, data = null) {
    res.status(200).json({
        success: true,
        message: message,
        data: data,
    });
}


function sendErrorResponse(res, message, code = 400){
      res.status(code).json({
        success: false,
        message: message,
        data: null,
    });

}

module.exports = {
    Helper,
    sendSuccessResponse,
    sendErrorResponse
}