
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
 var user = req.user
  user
  .getCart()
    .then(cart=>{ 
      cart.getProducts().then(
        products=>{ 
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products:products
          })
        }
      ).catch(err=>console.log(err))
    })  
}

exports.postCart = (req,res,next)=>{
 const prodId = req.body.productId;
 let fetchedCart;
 let newQuantity=1;
 req.user
 .getCart()
 .then(cart=>{
   fetchedCart = cart;
    cart.getProducts({where:{id:prodId}})
    .then(products =>{
      let product
      if(products.length>0){
       product = products[0];
      }
      if(product){
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product
      } 
      return Product.findAll({where:{id:prodId}})
    })
    .then(product=>{
        return fetchedCart.addProducts(product, {through: {quantity:newQuantity}})
    })
    .then(()=>{
      res.redirect('/cart')
    })
    .catch(err=>console.log(err))
 }) 
}

exports.getOrders = (req,res,next)=>{
  res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
    }) 
}

exports.deleteCartItem = (req,res,next  )=>{
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