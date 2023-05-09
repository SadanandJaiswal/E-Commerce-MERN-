const express = require('express');
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails,createProductReview ,getProductReviews, deleteReview} = require('../controllers/productController');
const { isAuthenticatedUser ,authorizeRoles} = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(getAllProducts);
// router.post('/product/new',createProduct);
// router.route('/product/:id').put(updateProduct);
// router.route('/productDetail/:id').get(getProductDetails);

// router.get('/products',getAllProducts);

router.route("/product/new").post(isAuthenticatedUser,createProduct);

router.route('/product/:id')
.put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)
.get(getProductDetails);

router.route('/review')
.put(isAuthenticatedUser,createProductReview);

router.route('/reviews')
.delete(isAuthenticatedUser,deleteReview)

router.route('/reviews?:id').get(getProductReviews);

module.exports = router;