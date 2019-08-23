var path = require('path');
var express = require('express');
var router = express.Router();

var shopControllers = require('../controllers/shop')

router.get('/', shopControllers.getIndex)
router.get('/products',shopControllers.getProducts)
router.get('/products/:productId',shopControllers.getProduct)
router.get('/cart',shopControllers.getCart)
router.post('/cart',shopControllers.postCart)
router.get('/orders',shopControllers.getOrders)
router.get('/checkout',shopControllers.getCheckOut)
router.post('/delete-cart-item', shopControllers.deleteCartItem)

module.exports = router;