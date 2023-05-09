const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv =require('dotenv').config({path:"../config/.env"});
const cookieParser = require('cookie-parser')
const cors = require('cors')

// const errorMiddleware = require('./middleware/error')
// app.use(errorMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// route imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoutes');
const order = require('./routes/orderRoute');
// app.use("api/v1",product);
app.use(product);
// app.use("api/v1",user);
app.use(user);
app.use(order);



// middleware for error

module.exports = app;