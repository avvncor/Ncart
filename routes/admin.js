var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/admin')
var isAuth = require('../middleware/is-auth')

router.get('/add-product', isAuth, adminControllers.getAddProduct)

router.get('/products', isAuth, adminControllers.getProducts)

router.post('/add-product', isAuth, adminControllers.postAddProduct)

router.get('/edit-product/:productId',isAuth, adminControllers.getEditProduct)

router.post('/postEditProduct',isAuth, adminControllers.postEditProduct)

router.post('/delete-product',isAuth, adminControllers.postDeleteProduct)

module.exports = router

