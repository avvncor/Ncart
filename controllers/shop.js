
const Product = require('../models/products')
// const Cart = require('../models/cart')
const Order = require('../models/order')

exports.getProducts = (req,res,next)=>{
    Product.find().then(products=>{
      res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products',
          hasProducts: products.length > 0,
          isAuthenticated:req.session.isLoggedIn
        })
  }); 
}

exports.getProduct = (req,res,next)=>{
  const prodId = req.params.productId;
  Product.findById(prodId).then(product=>{
    res.render('shop/product-detail',{
      product:product,
      pageTitle:'Product Detail',  
      path:'/products',
      isAuthenticated:req.session.isLoggedIn
    })
  })
}

exports.getIndex = (req,res,next)=>{
    Product.find().then(products=>{
      res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
          isAuthenticated:req.session.isLoggedIn
        })
    });
}

exports.getCart = (req,res,next)=>{
 var user = req.user
  user
  .populate('cart.items.productId')
   .execPopulate()
    .then(user=>{ 
      const products =  user.cart.items
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products:products,
            isAuthenticated:req.session.isLoggedIn 
          })
    })
    .catch(err=>console.log(err))  
}

exports.postCart = (req,res,next)=>{
  var id = req.body.productId;

  Product.findById(id)
  .then(product=>{
    return req.user
     .addToCart(product)
  })
  .then(result=>{
    console.log('product added to cart')
    
  })
  .catch(err=>console.log(err))
  res.redirect('/cart')
}

exports.getOrders = (req,res,next)=>{
  Order.find({'user.userId':req.user._id})
  .then(orders=>{
   
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders:orders,
      isAuthenticated:req.session.isLoggedIn
    }) 
  })
  .catch()
  
}

exports.deleteCartItem = (req,res,next)=>{
  const prodId =  req.body.productId       
  req.user
   .deleteItemFromCart(prodId)
   .then(cart=>{
     res.redirect('/cart')
      
   })
  .catch(err=>console.log(err))
}

exports.getCheckOut = (req,res,next)=>{
 
    res.render('shop/checkout', {
        prods: products,
        pageTitle: 'Checkout',
        path: '/cart',
        isAuthenticated:req.session.isLoggedIn
      }) 
}

exports.postOrder = (req,res,next)=>{

  var user = req.user

  user
  .populate('cart.items.productId')
   .execPopulate()
    .then(user=>{ 
      const products =  user.cart.items
      .map(i=>{
        return { product:{ ...i.productId._doc }, quantity:i.quantity}
      })
      // res.json(products)
      
      order = new Order({
        user:{
          name:req.user.email,
          userId:req.user._id
        },
        products:products
      })
      return order.save()
    })
    .then(result=>{
      return req.user.clearCart()
    })
    .then((result)=>{
      res.redirect('/cart')
    })
    .catch(err=>console.log(err))
  }