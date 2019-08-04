var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
var dir = require('./util/path')

app.set('view engine','ejs')
app.set('views','views')

var adminData = require('./routes/admin')
var shopRoutes = require('./routes/shop')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminData.routes)
app.use(shopRoutes)

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(dir,'views','404.html'))
})

app.listen(2000)
console.log('listening')

