const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');



// uncaught error
process.on('uncaughtException',(err)=>{
    console.log(`error ${err.message}`);
    console.log('sutting down the server');
    process.exit(1);
})
// eg --> console.log(youtube);




dotenv.config({path:"backend/config/config.env"});

// connecting to database
connectDatabase();

// const Product = require('./models/productModel');
// app.post('/product/new',async (req,res)=>{
//     const product = await Product.create(req.body);
//     res.status(201).json({
//         success:true,
//         product
//     })
// })

const server = app.listen(4000,()=>{
    console.log(`server is working on ${4000}`);
})



// unhandeled promise rejection
process.on('unhandledRejection',err=>{
    console.log('error ' + err.message);
    console.log('sutting down the server');

    server.close(()=>{
        process.exit(1)
    })
})