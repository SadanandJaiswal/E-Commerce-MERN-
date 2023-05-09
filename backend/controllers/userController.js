const User = require('../models/userModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHander = require('../utils/errorhandeler');
const sendToken = require('../utils/jwtToken');
const dotenv =require('dotenv').config({path:"../config/.env"});
const sendEmail = require('../utils/sendEmail.js')
const crypto = require('crypto')

// Register User

exports.registerUser = async(req,res,next)=>{
// const registerUser = async(req,res)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"
        }
    });
    // const token = user.getJwtToken();
    // console.log('token --> '+token)
    // console.log(user);
    // res.status(201).json({
    //     success:true,
    //     user,
    //     token
    // })

    sendToken(user,201,res);
}

// login user
exports.loginUser = async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password)
    {
        return next(new ErrorHander("Please Enter Email and Password"))
    }

    const user = await User.findOne({email}).select("password");
    // await lagana jaruri hai
    // console.log('user -->')
    // console.log(user)

    if(!user)
    {
        return next(new ErrorHander("Invalid email or password"));
    }

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched)
    {
        return next(new ErrorHander("Invalid email or password"));
    }
    // const token = user.getJwtToken();
    // // console.log('token --> ' + token)

    // res.status(200).json({
    //     success:true,
    //     token
    // })

    sendToken(user,200,res);

    console.log('successfully login')
}


exports.logout = async(req,res,next)=>{

    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"logout successful",
    })
}

// forget password
exports.forgetPassword = async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHander('User not found',404))
    }

    // get reset token
    const resetToken  = user.forgetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is : = \n\n 
    ${resetPasswordUrl} \n\n
    If you have not requested this email then, please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:"Ecommerce Password Recovery",
            message,
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    }
    catch(e){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHander(error.message,500));
    }
}


// reset password
exports.resetPassword = async(req,res,next)=>{

    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHander('Reset password token is invalid or has been expired',404))
    }

    if(req.body.password != req.body.confirmPassword)
    {
        return next(new ErrorHander('password does not matched'))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);
}


// get user details
exports.getUserDetails = async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    // console.log(req.user);

    res.status(200).json({
        success:true,
        user,
        res_id: req.user.id,
        // decodedData:decodedData,
    })
}


// update user password
exports.updatePassword = async(req,res,next)=>{
    const user = await User.findById(req.user._id).select("password");
    
    const isPasswordMatched = user.comparePassword(req.body.oldpassword);

    if(!isPasswordMatched)
    {
        return next(new ErrorHander("old password is incorrect",400));
    }
    
    if(req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHander("Password doesnt matched",400));
    }

    user.password = req.body.newPassword
    user.save();

    sendToken(user,200,res);
}

// update user profile
exports.updateProfile = async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        // role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        // runValidators:true,
        // useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
        user,
    })
}

// get all users
exports.getAllUser = async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
}

// get users Details (admin)
exports.getSingleUser = async(req,res,next)=>{

    // const users = await User.find({role:"admin"});
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`User does not exist with id ${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user,
    })
}


// update admin profile
exports.updateUserRole = async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        // runValidators:true,
        // useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
        user,
    })
}

// delete user profile
exports.deleteUser = async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`user does not exist with id ${req.params.id}`));
    }

    await User.deleteOne(user);
    

    res.status(200).json({
        success:true,
        message: `user removed from database with id ${req.params.id}`,
        user:user,
    })
}