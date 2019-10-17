var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/admin')
var isAuth = require('../middleware/is-auth')
const { body } = require('express-validator/check')

router.get('/add-product', isAuth, adminControllers.getAddProduct)

router.get('/products', isAuth, adminControllers.getProducts)

router.post('/add-product',[
    body('title')
      .isString()
      .isLength({min:3})
      .trim(),
    body('imageUrl')
      .isURL(),
    body('price')
      .isFloat(),
    body('description')
      .isLength({min:8, max:400})
      .trim()
     
], isAuth, adminControllers.postAddProduct)

router.get('/edit-product/:productId',isAuth, adminControllers.getEditProduct)

router.post('/postEditProduct',[
    body('title')
      .isString()
      .isLength({min:3})
      .trim(),
    body('imageUrl')
      .isURL(),
    body('price')
      .isFloat(),
    body('description')
      .isLength({min:8, max:400})
      .trim()
     
],isAuth, adminControllers.postEditProduct)

router.post('/delete-product',isAuth, adminControllers.postDeleteProduct)

module.exports = router

