const { Error } = require('mongoose');
const ErrorHander = require('../utils/errorhandeler')


module.exports = (err,req,res,next)=>{
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong mongodb id error
    if(err.name ==- 'CastError')
    {
        const message = 'Resource not found. Invalid: ' + err.path;
        err = new ErrorHander(message,400);
    }

    // mongoose duplicate key error
    if(err.code === 11000)
    {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHander(messaage,400);
    }

    // wrong JWT error
    if(err.name === "JsonWebTokenError")
    {
        const message = `Json Web Token is invalid, try again`
        err = new ErrorHander(messaage,400);
    }

    // JWT expire error
    if(err.name === "TokenExpiredError")
    {
        const message = `Json Web Token is Expired, try again`
        err = new ErrorHander(messaage,400);
    }

    res.status(err.statuscode).json({
        success:false,
        // error:err
        // error:err.stack,
        error:err.message
    })
}