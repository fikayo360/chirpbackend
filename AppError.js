class AppError extends Error{
    constructor(errorCode,message,statusCode){
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

let ce = new AppError(500,'internal server error',500)

module.exports = AppError;