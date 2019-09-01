
const Product = require('../models/products')
const Cart = require('../models/cart')

exports.getProducts = (req,res,next)=>{
    Product.findAll().then(products=>{
      res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products',
          hasProducts: products.length > 0,
        })
  }); 
}

exports.getProduct = (req,res,next)=>{
  const prodId = req.params.productId;
  Product.findAll({where: {id:prodId}}).then(product=>{
    res.render('shop/product-detail',{
      product:product[0],
      pageTitle:'Product Detail',  
      path:'/products'  
    })
  })


}

exports.getIndex = (req,res,next)=>{
    Product.findAll().then(products=>{
      res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
        })
    });
}

exports.getCart = (req,res,next)=>{
  Cart.getCart(cart=>{
    Product.fetchAll(products=>{
      const cartProducts = []
      for(product of products){
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if(cartProductData){
          cartProducts.push({productData:product, qty:cartProductData.qty})
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products:cartProducts
      }) 
    })
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

exports.deleteCartItem = (req,res,next)=>{
  const prodId =  req.body.productId       
  Product.findById(prodId,product=>{
    Cart.deleteProduct(prodId,product.price)
    res.redirect('/cart')
  })
}

exports.getCheckOut = (req,res,next)=>{
    res.render('shop/checkout', {
        prods: products,
        pageTitle: 'Checkout',
        path: '/cart',
      }) 
}