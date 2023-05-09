const ErrorHander = require("../utils/errorhandeler");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.isAuthenticatedUser = async(req,res,next)=>{
    // const token = req.cookies;
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHander("Please Login to access this resource"));
    }   

    const decodedData = jwt.verify(token,"ljkdashfuiwm,mvxsjfoqwui23828476ksddfsdnmxv;[[sfdfdsf]]dfsf")

    // console.log('decodedData '+decodedData);
    // console.log('decodedData id '+decodedData.id)

    req.user = await User.findById(decodedData.id);
    // console.log(token);
    next();
};

exports.authorizeRoles = (...roles) =>{
    return (req,res,next)=>{
        
        if(!roles.includes(req.user.role))
        {
            return next(
                new ErrorHander(`Role: ${req.user.role} is not allowed to access this resource`,403)
            )

        }
        next();
    }
}