const fs = require('fs');
const path = require('path')
const Product = require('../models/products')
// const Cart = require('../models/cart')
const Order = require('../models/order')
const pdfDocument = require('pdfkit')

const itemsPerPage = 2;

exports.getProducts = (req,res,next)=>{
  const page = +req.query.page || 1;
  let totalItems = 0;

    Product.find()
    .countDocuments()
    .then(numProducts=>{
        totalItems = numProducts;
        return Product.find()
        .skip((page-1)* itemsPerPage)
        .limit(itemsPerPage)
    })
    .then(products =>{
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated:req.session.isLoggedIn,
        currentPage:page,
        totalProducts:totalItems,
        hasNextPage: itemsPerPage * page < totalItems,
        hasPreviousPage:page>1,
        nextPage:page + 1,
        previousPage:page - 1,
        lastPage: Math.ceil(totalItems / itemsPerPage)
      })
    })
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
 })
}

exports.getIndex = (req,res,next)=>{
  
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
  .countDocuments()
  .then(numProducts => {
     totalItems = numProducts;
     return Product.find()
    .skip((page-1) * itemsPerPage)
    .limit(itemsPerPage)

  })
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated:req.session.isLoggedIn,
      currentPage:page,
      totalProducts:totalItems,
      hasNextPage: itemsPerPage * page < totalItems,
      hasPreviousPage:page>1,
      nextPage:page + 1,
      previousPage:page - 1,
      lastPage: Math.ceil(totalItems / itemsPerPage)
    })
  } )
  .catch(err => {
    console.log(err)
  })
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
   }) 
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
  .catch(err => {
    console.log(err)
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
 })
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
 })
  
}

exports.deleteCartItem = (req,res,next)=>{
  const prodId =  req.body.productId       
  req.user
   .deleteItemFromCart(prodId)
   .then(cart=>{
     res.redirect('/cart')
      
   })
   .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
 })
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
          email:req.user.email,
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
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
   })
  }

  exports.getInvoice = (req,res,next) => {
     const orderId = req.params.orderId;
     const invoiceName = 'invoice-'+orderId+'.pdf';
     const invoicePath = path.join('data','invoices',invoiceName);
      Order.findById(orderId)
      .then(orders =>{
        if(!orders){
          return next(new Error('No Order found'))
        }
        if(orders.user.userId.toString() !== req.user._id.toString() ){
          return next(new Error('Unauthorized'))
        }

        const pdfDoc = new pdfDocument()
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"')
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res)
        pdfDoc.fontSize(36).text('Avvncor Corporation\n\n') 
        pdfDoc.fontSize(26).text('Invoice',{
          underline:true
        })   
        pdfDoc.text('-------------------------------------');
         let totalPrice = 0;
        orders.products.forEach(order => {
          totalPrice = totalPrice + order.product.price * order.quantity
          pdfDoc.text(order.product.title+ '- (' +order.quantity  + ') x ' + '$' + order.product.price)
        })
        pdfDoc.fontSize(20).text('Total Price:  '+totalPrice)
        pdfDoc.end()

        // const file = fs.createReadStream(invoicePath)
        // res.setHeader('Content-Type','application/pdf');
        // res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"')
        // file.pipe(res)
      })
      .catch(err => {
        return next(err)
      })
      
    //  fs.readFile(invoicePath, (err, data) => {
    //     if(err){
    //       console.log(err)
    //     }
    //     res.setHeader('Content-Type','application/pdf');
    //     res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"')
    //     res.send(data)
    //  })  
  }