var path = require('path');
var express = require('express');
var router = express.Router();

var productControllers = require('../controllers/products')

router.get('/', productControllers.getProducts)

module.exports = router;