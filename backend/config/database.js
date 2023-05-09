const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path:"backend/config/config.env"});

const conenctDatabase = ()=>{
    // mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,userUnifiedTopology:true,useCreateIndex:true})
    // mongoose.connect(process.env.DB_URL)

    mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce",{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useCreateIndex:true
    })
    // mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")
    .then((data)=>{
        console.log(`mongodb connected with server ${data.connection.host}`);
    })
    .catch((e)=>{
        console.log('error --> ' + e);
    })
}


module.exports = conenctDatabase;