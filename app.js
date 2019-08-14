var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
var dir = require('./util/path')
var errorController = require('./controllers/error')

app.set('view engine','ejs')
app.set('views','views')

var adminRoutes = require('./routes/admin')
var shopRoutes = require('./routes/shop')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'images'))) 

app.use('/admin',adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

app.listen(2000)
console.log('listening')

