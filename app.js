var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
var dir = require('./util/path')
var errorController = require('./controllers/error')
var sequelize = require('./util/database')

app.set('view engine','ejs')
app.set('views','views')

var adminRoutes = require('./routes/admin')
var shopRoutes = require('./routes/shop')
var Product = require('./models/products');
var User    = require('./models/user')
var Cart = require('./models/cart')
var CartItem = require('./models/cart-items')
var Order = require('./models/order')
var OrderItems = require('./models/orderItems')

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product,{through:OrderItems})
Product.belongsToMany(Order,{through:OrderItems})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'images'))) 

app.use((req,res,next)=>{

    User.findAll({where:{id:'2'}})
    .then(user=>{
        req.user = user[0]
        next();
    })
    .catch(err=>{console.log(err)})
})

app.use('/admin',adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'});
User.hasMany(Product)
///
User.hasOne(Cart)
Cart.belongsTo(User)
///
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})


sequelize
//  .sync({force:true})
 .sync()
.then(result=>{
    return User.findAll({where:{id:'2'}})
})
.then(user=>{
    if(user.length<=0)
    { 
        return User.create({name:'amaan',email:'yahoo'})
    }
   return user
})

.then(user=>{
    return user[0].createCart();
})
.then(cart=>{
    app.listen(2000);
    console.log('listening///////////////////////END//////////////////')
})
.catch(err=>{
    console.log('this is sequelize sync error '+ err)
})




