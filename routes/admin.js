var express = require('express');
var path = require('path')
var router = express.Router();
var dir = require('../util/path')
var adminControllers = require('../controllers/admin')

router.get('/add-product', adminControllers.getAddProduct)

router.get('/products', adminControllers.getProducts)

router.post('/add-product', adminControllers.postAddProduct)

router.get('/edit-product/:productId',adminControllers.getEditProduct)

router.post('/postEditProduct',adminControllers.postEditProduct)

router.post('/delete-product',adminControllers.postDeleteProduct)

module.exports = router

