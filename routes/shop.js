var path = require('path');
var express = require('express');
var router = express.Router();
var isAuth = require('../middleware/is-auth')
var shopControllers = require('../controllers/shop')

router.get('/', shopControllers.getIndex)
router.get('/products',shopControllers.getProducts)
router.get('/products/:productId',shopControllers.getProduct)
router.get('/cart',isAuth,shopControllers.getCart)
router.post('/cart',isAuth,shopControllers.postCart)
router.get('/orders',isAuth,shopControllers.getOrders)
// router.get('/checkout',shopControllers.getCheckOut)
router.post('/delete-cart-item',isAuth, shopControllers.deleteCartItem)
router.post('/create-order',isAuth, shopControllers.postOrder)
router.get('/orders/:orderId',isAuth,shopControllers.getInvoice)

module.exports = router;