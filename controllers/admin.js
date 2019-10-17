const Product = require('../models/products')
const { validationResult } = require('express-validator/check')

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false,
        isAuthenticated:req.session.isLoggedIn,
        hasError:false,
        errorMessage:null,
        validationErrors:[]
      });
}

exports.postAddProduct = (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log(errors.array())
       return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing:false,
            isAuthenticated:req.session.isLoggedIn,
            hasError:true,
            product:{
                title:req.body.title,
                price:req.body.price,
                description:req.body.description,
                imageUrl:req.body.imageUrl,
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
          });
    }

   const product = new Product ({
       title:req.body.title,
       price:req.body.price,
       description:req.body.description,
       imageUrl:req.body.imageUrl,
       userId: req.user._id
   });

   product.save()
   .then(result=>{
       console.log('Product Created')
       return result
   })
   .then(result => {
    res.redirect('/admin/products')
   })
   .catch(err=>console.log(err))
  
}

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId).then(product=>{
 
        if(product.length<=0){
            res.redirect('/Product-Not-Found')
        }
        res.render('admin/edit-product',{
            path:"/admin/add-product",
            pageTitle:"Edit Product",
            editing:editMode,
            product:product,
            isAuthenticated:req.session.isLoggedIn,
            hasError:false,
            errorMessage:null,
            validationErrors:[]
        })
        
     }) 
}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log(errors.array())
       return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing:true,
            isAuthenticated:req.session.isLoggedIn,
            hasError:true,
            product:{
                title:req.body.title,
                price:req.body.price,
                description:req.body.description,
                imageUrl:req.body.imageUrl,
                id:prodId
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
          });
    }
    Product.findById(prodId)
    .then(product =>{
        
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/')
        }
         
         product.title = req.body.title;
         product.price = req.body.price;
         product.description = req.body.description;
         product.imageUrl = req.body.imageUrl;
         product.userId = req.user._id;
         
         return product.save()
         .then(result => {
              console.log('Product Updated');
              res.redirect('/admin/products')
            })
    })
     
    .catch(err=>{throw err})
}

exports.getProducts =  (req,res,next)=>{
    Product.find({userId:req.user._id})
    .populate('userId')
    .then(products=>{
        console.log(products)
        res.render('admin/products', {
            prods:products,
            pageTitle: 'Admin Products',
            path: '/admin/products',   
            isAuthenticated:req.session.isLoggedIn   
          })
     })
    };

exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId;

    // Product.findByIdAndDelete(prodId)
    Product.deleteOne({_id:prodId, userId:req.user._id})
    .then(result => { 
        console.log('Product Deleted ');
         res.redirect('/admin/products')
        })
    .catch( err => {
        throw err
    })
}