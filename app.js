var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var adminRoutes = require('./routes/admin')
var shopRoutes = require('./routes/shop')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/admin',adminRoutes)
app.use(shopRoutes)

app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not found</h2>')
})

app.listen(2000)
console.log('listening')

