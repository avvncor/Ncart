const Product = require('../models/products')

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false
      });
}

exports.postAddProduct = (req,res,next)=>{
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description)
    product.save();
    res.redirect('/')
}

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId,product=>{
        if(!product){
            res.redirect('/Not-Found')
        }
        res.render('admin/edit-product',{
            path:"/admin/add-product",
            pageTitle:"Edit Product",
            editing:editMode,
            product:product
        })
    })
   
}

exports.getProducts =  (req,res,next)=>{
    Product.fetchAll(products=>{
        res.render('admin/products', {
            prods:products,
            pageTitle: 'Admin Products',
            path: '/admin/products',      
          })
     })
    };