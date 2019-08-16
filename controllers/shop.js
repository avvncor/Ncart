
const Product = require('../models/products')
const Cart = require('../models/cart')

exports.getProducts = (req,res,next)=>{
    Product.fetchAll(products=>{
      res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products',
          hasProducts: products.length > 0,
          activeShop: true,
          productCSS: true
        })
  }); 
}

exports.getProduct = (req,res,next)=>{
  const prodId = req.params.productId;
  Product.findById(prodId,prod=>{
    res.render('shop/product-detail',{
      product:prod,
      pageTitle:'Product Detail',  
      path:'/products'  
    })
  })
}

exports.getIndex = (req,res,next)=>{
    Product.fetchAll(products=>{
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
          })
    });
}

exports.getCart = (req,res,next)=>{
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
          }) 
}

exports.postCart = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.findById(prodId,product=>{
    Cart.addProduct(prodId,product.price)
  })
  res.redirect('/cart')
}

exports.getOrders = (req,res,next)=>{
  res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
    }) 
}

exports.getCheckOut = (req,res,next)=>{
    res.render('shop/checkout', {
        prods: products,
        pageTitle: 'Checkout',
        path: '/cart',
      }) 
}