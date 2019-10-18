var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
var dir = require('./util/path')
var errorController = require('./controllers/error')
var mongoose = require('mongoose');
var session = require('express-session')
var MongoDbStore = require('connect-mongodb-session')(session);
//var csurf = require('csrf');

app.set('view engine','ejs')
app.set('views','views')

var dbString = 'mongodb://localhost:27017/nodeComplete';

var store = new MongoDbStore({
    uri:'mongodb://localhost:27017/nodeComplete',
    collection:'session',
})

var adminRoutes = require('./routes/admin')
var shopRoutes = require('./routes/shop')
var Product = require('./models/products');
var User    = require('./models/user')
var authRoutes = require('./routes/auth')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}))

app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'images'))) 

app.use((req,res,next)=>{
     
    if(!req.session.user){
        return next()
    }
    User.findById(req.session.user._id)
    .then(user=>{ 

        if(!user){
            return next()
        }  
        req.user=user;
        next();
    })
    .catch(err => {
        next(new Error(err));
     })    
})

app.use('/admin',adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use('/500',errorController.get500)
app.use(errorController.get404)

app.use((error,req,res,next) => {
    res.status(500).render('500',{
        pageTitle:'Error',
        path:'/500',
        isAuthenticated:req.session.isLoggedIn
    })
})

mongoose.connect(dbString,{useNewUrlParser:true})
.then(result=>{
    app.listen(2000)
    console.log('listening 2000')
})
.catch(err=>{
    res.redirect('/500')
})