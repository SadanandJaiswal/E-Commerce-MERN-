const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHander = require('../utils/errorhandeler');


// create products  -- for admin
exports.createProduct = async(req,res,next)=>{
// const createProduct = async(req,res,next)=>{
    console.log(req.body, typeof req.body);
    req.body.user = req.body.id;
    const product = await Product.create(req.body);
    // const product = await Product.insertMany([req.body]);
    // const product = new Product(req.body);
    // const result = await product.save();
    // const product = new Product(req.body);
    // const result = await product.save();
    res.status(201).json({
        success:true,
        // result,
        product
    });
    console.log(product);
}


// get all product
exports.getAllProducts = async (req,res,next)=>{
// getAllProducts = async (req,res)=>{
    // return next(new ErrorHander("this is my temperory error"))
    const resultPerPage = 8;
    // const productCount = await Product.find().count({name:1})
    const productsCount = await Product.countDocuments();
    // const apifeature = new ApiFeatures(Product.find(),req.query).search().filter(); //.pageination(resultPerPage);
    // const apifeature = new ApiFeatures(Product.find(),req.query);//.search().filter(); //.pageination(resultPerPage);
    // const apifeature = new ApiFeatures(Product.find(),req.query)
    // .search().pageination(resultPerPage);
    const apifeature = new ApiFeatures(Product.find(),req.query)
    .search();
    // .filter();
    // .pageination();
    // const apifeature = new ApiFeatures(Product.find(),req.query).filter();
    // const apifeature = new ApiFeatures(Product.find(),req.query).pageination(resultPerPage);
    

    
    apifeature.pageination(resultPerPage);
    const products = await apifeature.query;
    // const products = await Product.find();
    let filteredProductsCount = products.length;
    // const productsCount = await products.length;
    // console.log(products.length)
    res.status(200).json({
        success:true,
        products,
        productsCount,
        shownProducts:products.length,
        req:req.query,
        resultPerPage,
        filteredProductsCount,
    });
}


// update product   -- admin

exports.updateProduct = async(req,res)=>{
// updateProduct = async(req,res)=>{
    let product = Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:false});
    


    res.status(200).json({
        success:true,
        product
    })

    
}


// get product details

exports.getProductDetails = async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product)
    {
        // console.log('not found')
        // res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })

        // adding error handeler
        return next(new ErrorHander("product not found",400));
    }
    else{
        res.status(200).json({
            success:true,
            product,
            id:req.params.id
        })
    }
}


// delete product 
exports.deleteProduct = async(req,res)=>{
// deleteProduct = async(req,res)=>{
    let product = await Product.findById(req.params.id);

    if(!product)
    {
        console.log('not found')
        res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
  
    else{
        // product = await Product.findByIdAndDelete(req.params.id)
        // // product = await Product.findByIdAndDelete({_id:req.param.id});
        // // const result = await product.remove();
        // // const product = await Product.findById(req.params.id);
        
        console.log('done')
        console.log('found')

        let result = Product.deleteOne({_id:req.params.id});

        res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
        })

    }
}

// create new review or update the review
exports.createProductReview = async(req,res,next)=>{

    const {rating , comment, productid} = req.body;

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productid);

    const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id
        )    // rev ke andar user ki id mil jayegi

    if(isReviewed)
    {
        product.reviews.forEach((rev =>{
            if((rev) => rev.user.toString() === req.user._id)
            {
                rev.rating = rating;
                rev.comment = comment;
            }
        }))
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg =0;
    product.reviews.forEach(rev=>{
        avg+= rev.rating;
    })
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        messaage:"review successful",
    })
}


// get all reviews
exports.getProductReviews = async(req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product)
    {
        return next(new ErrorHander('product not found',404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
}

// delete review of product
exports.deleteReview = async(req,res,next)=>{

    const product = await Product.findById(req.query.productid);

    if(!product)
    {
        return next(new ErrorHander('product not found',404));
    }

    const reviews = product.reviews.filter(rev=> rev._id.toString() != req.query.id.toString());
    // jo hume nhi chahiye usse yeh filter hata dega

    let avg =0;
    reviews.forEach(rev=>{
        avg+= rev.rating;
    })
    const ratings = avg/reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productid,{
        reviews,ratings,numOfReviews
    },
    {
        new:true
    })

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        message:"review deleted successfully",
    })
}