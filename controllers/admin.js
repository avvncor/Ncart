const Product = require('../models/products')

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false,
        isAuthenticated:req.isLoggedIn
      });
}

exports.postAddProduct = (req,res,next)=>{
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
       res.redirect('/admin/product')
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
            isAuthenticated:req.isLoggedIn
        })
        
     }) 
}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product =>{
         product.title = req.body.title;
         product.price = req.body.price;
         product.description = req.body.description;
         product.imageUrl = req.body.imageUrl;
         product.userId = req.user._id;
         return product.save();
    })
     .then(result=>{console.log('Product Updated');res.redirect('/admin/products')})
    .catch(err=>{throw err})
}

exports.getProducts =  (req,res,next)=>{
    Product.find()
    .populate('userId')
    .then(products=>{
        console.log(products)
        res.render('admin/products', {
            prods:products,
            pageTitle: 'Admin Products',
            path: '/admin/products',   
            isAuthenticated:req.isLoggedIn   
          })
     })
    };

exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findByIdAndDelete(prodId)
    .then(result=>{console.log('Product Deleted '); res.redirect('/admin/products')})
    .catch(err=>{throw err})
}