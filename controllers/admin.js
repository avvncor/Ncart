const Product = require('../models/products')
const { validationResult } = require('express-validator/check')
const mongoose = require('mongoose');
const fileHelper = require('../util/file');

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
    var title = req.body.title;
    var price = req.body.price;
    var description = req.body.description;
    var image = req.file;

    if(!image){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing:false,
            isAuthenticated:req.session.isLoggedIn,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description,
            },
            errorMessage:'Attached file is not an image',
            validationErrors:[]
          });
    }

    var imageUrl = image.path;

    if(!errors.isEmpty()){
        console.log(errors.array())
       return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing:false,
            isAuthenticated:req.session.isLoggedIn,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description,
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
          });
    }
  console.log(req.file)
   const product = new Product ({
       title:title,
       price:price,
       description:description,
       imageUrl:imageUrl,
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
   .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
   })
  
}

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId).then(product=>{
 
        if(product.length<=0){
            return res.redirect('/Product-Not-Found')
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
     .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
     })
}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const errors = validationResult(req)
    const image = req.file


    if(!errors.isEmpty()){
	console.log(errors)
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
         if(image){
            fileHelper.deleteFile(product.imageUrl); 
            product.imageUrl = image.path;
         } 
         product.userId = req.user._id;
         
         return product.save()
         .then(result => {
              console.log('Product Updated');
              res.redirect('/admin/products')
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error)
             })
    })
     
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
     })
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
     .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
     })
    };

exports.postDeleteProduct= (req,res,next)=>{
   
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product =>{
        if(!product){
            return next(new Error('Product not found'))
        }
        fileHelper.deleteFile(product.imageUrl); 
        return  Product.deleteOne({_id:prodId, userId:req.user._id})
    })
    .then(result => { 
        console.log('Product Deleted ');
         res.redirect('/admin/products')
        })
    .catch( err => next(err) )
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product =>{
        if(!product){
            return next(new Error('Product not found'))
        }
        fileHelper.deleteFile(product.imageUrl); 
        return  Product.deleteOne({_id:prodId, userId:req.user._id})
    })
    .then(result => { 
        console.log('Product Deleted ');
        res.status(200).json({message:"Delete Successful"})
            //
        })
    .catch( err => {
        res.status(500).json({message:"We are currently fixing this"})
    })
}