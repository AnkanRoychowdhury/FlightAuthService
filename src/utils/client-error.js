const { StatusCodes } = require("http-status-codes");
const AppErrors = require("./error-handler");

class ClientErrors extends AppErrors {
    constructor(name,message,explanation,statusCode){
        super(name,message,explanation,statusCode)
    }
}

module.exports = ClientErrors;