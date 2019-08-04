var path = require('path');
var express = require('express');
var router = express.Router();
var dir = require('../util/path')

var adminData = require('./admin')

router.get('/',(req,res,next)=>{
    console.log(adminData.products)
    res.sendFile(path.join(dir,'views','shop.html'))
})

module.exports = router;