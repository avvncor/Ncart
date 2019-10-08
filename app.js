var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
var dir = require('./util/path')
var errorController = require('./controllers/error')
var mongoose = require('mongoose');

app.set('view engine','ejs')
app.set('views','views')

var adminRoutes = require('./routes/admin')
var shopRoutes = require('./routes/shop')
var Product = require('./models/products');
var User    = require('./models/user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use((req,res,next)=>{
    User.findById('5d9a05f857c11e27c4b8673f')
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err))
})

app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'images'))) 

app.use('/admin',adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb://localhost:27017/nodeComplete',{useNewUrlParser:true})
.then(result=>{
    app.listen(2000)
    console.log('listening 2000')

    User.findOne()
    .then(users=>{
        if(!user){
            var user = new User({
                name:'Amaan',
                email:'amaan@gmail.com',
                cart:{
                    items:[]
                }
            })
            user.save()
        }
    })
    .catch(err=>console.log(err))
})
.catch(err=>{
    console.log(err)
})