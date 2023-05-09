const Order = require("../models/orderModel.js");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require("../utils/errorhandeler");
const User = require("../models/userModel");

//  create new order
exports.newOrder = async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id,
  });

  res.status(201).json({
    success:true,
    order,
  })
};


// get single order
exports.getSingleOrder = async(req,res,next)=>{
  const order = await Order.findById(req.params.id).populate("user","name email");

  if(!order)
  {
    return next(new ErrorHander('Order Not Found with this id',404));
  }

  res.status(200).json({
    success:true,
    order,
  })

}

//  get logged in user order
exports.myOrders = async(req,res,next)=>{
  const orders = await Order.find({user:req.user._id});

  res.status(200).json({
    success:true,
    orders,
  })

}

// get all orders --admin
exports.getAllOrders = async(req,res,next)=>{
  const order = await Order.find();

  let totalAmount = 0;

  order.forEach(order=>{
    totalAmount+= order.totalPrice;
  })

  res.status(200).json({
    success:true,
    totalAmount,
    order,
  })

}

// update orders status --admin
exports.updateOrder = async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if(!order)
  {
    return next(new ErrorHander("Order Not found with this id",404))
  }

  if(order.orderStatus==="Delivered")
  {
    return next(new ErrorHander("You have already delivered this order",400));
  }

  order.orderItems.forEach(async (order)=>{
    await updateStock(order.product,order.quantity);
  })

  order.orderStatus = req.body.status;

  if(req.body.status  === 'Delivered')
  {
    order.deliverdAt = Date.now();
  }

  await order.save({validateBeforeSave:false});
  res.status(200).json({
    success:true,
    order,
  })

}


async function updateStock(id,quantity){
  const product = await Product.findById(id);

  console.log('prodcut stock --> '+product.stock);
  console.log('quantity '+quantity);


  product.stock -= quantity;

  console.log('prodcut stock --> '+product.stock);
  console.log('quantity '+quantity);

  await product.save({validateBeforeSave:false});
}


// delete orders 
exports.deleteOrder = async(req,res,next)=>{
  const _id = req.params.id;
  const order = await Order.findById(_id);

  if(!order)
  {
    return next(new ErrorHander('Order Not Found with this id',404));
  }

  await Order.findByIdAndDelete(_id);

  res.status(200).json({
    success:true,
    message:"order deleted successfully",
    order,
  })

}
