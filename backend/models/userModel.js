const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

require('dotenv').config({path:"../config/.env"});

console.log(process.env.JWT_secretKey);
console.log(process.env.JWT_expire);

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxLength:[30,"Name cannot exceed 30 character"],
    },
    email:{
        type:String,
        required:[true,"Please Enter your Email"],
        // unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your Password"],
        minLength:[8,"Password Should be greater or equal to 8 character"],
        select:false
    },
    avatar:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){
    
    if(!this.isModified("password"))
    {
        next();
    }
    this.password = await bcrypt.hash(this.password,10);

}); // yeh ek event hai

// JWT Token
// userSchema.methods.getJwtToken = function (){
//     console.log('jwt_secretkey ' + process.env.JWT_secretKey);
//     console.log('jwt_expire ' + process.env.JWT_expire);
//     return jwt.sign({id:this._id},process.env.JWT_secretKey,{
//         expiresIn:process.env.JWT_expire,
//     });
// }

userSchema.methods.getJwtToken = function (){
    return jwt.sign({id:this._id},"ljkdashfuiwm,mvxsjfoqwui23828476ksddfsdnmxv;[[sfdfdsf]]dfsf",{
        expiresIn:"5d",
    });
}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password);
}

// generating password reset token

userSchema.methods.forgetPasswordToken = function(){

    // gerenerating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // sirf randombyte use karne pe buffer value dega
    // sirf to string se kuch alag hi value dega
    // hex use karne pe proper required value dega

    // const tokenCrypto = 
    // hashing and storing to user schema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest('hex');

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;

}

module.exports = mongoose.model("User",userSchema);