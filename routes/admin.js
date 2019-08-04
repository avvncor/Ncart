var express = require('express');
var path = require('path')
var router = express.Router();
var dir = require('../util/path')

var products = []

router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(dir,'views','add-product.html'))
})

router.post('/add-product',(req,res,next)=>{
    products.push({title:req.body.title})

    res.redirect('/')
})

exports.routes = router;
exports.products = products;
