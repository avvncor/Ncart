var express = require('express');

var router = express.Router();

router.get('/add-product',(req,res,next)=>{
    res.send('<html><form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Submit</button></form></html>')
})

router.post('/add-product',(req,res,next)=>{
    console.log(req.body)
    res.redirect('/')
})

module.exports = router;