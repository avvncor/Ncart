var express = require('express');
var path = require('path')
var router = express.Router();
var dir = require('../util/path')
var productsControllers = require('../controllers/products')

router.get('/add-product', productsControllers.getAddProduct)

router.post('/add-product', productsControllers.postAddProduct)

module.exports = router

