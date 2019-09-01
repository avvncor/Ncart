const Product = require('../models/products')

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false
      });
}

exports.postAddProduct = (req,res,next)=>{
    console.log(req.user,'request user')
    req.user
        .createProduct({
            title:req.body.title,
            imageUrl:req.body.imageUrl,
            price:req.body.price,
            description:req.body.description
        })
    .then(result=>{console.log('Product Created'); res.redirect('/admin/products')})
    .catch(err=> {throw err})
}

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/')
    }
    const prodId = req.params.productId;
    req.user.getProducts({where : {id:prodId}}).then(product=>{
        
        if(product.length<=0){
            res.redirect('/Not-Found')
        }
        console.log(product)
        res.render('admin/edit-product',{
            path:"/admin/add-product",
            pageTitle:"Edit Product",
            editing:editMode,
            product:product[0]
        })
        
     }) 
}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findAll({where : {id:prodId}})
    .then(product =>{
        
         product[0].title = req.body.title;
         product[0].price = req.body.price;
         product[0].description = req.body.description;
         product[0].imageUrl = req.body.imageUrl;
         return product[0].save();
    })
    .then(result=>{console.log('Product Updated');res.redirect('/admin/products')})
    .catch(err=>{throw err})
    
}

exports.getProducts =  (req,res,next)=>{
    req.user.getProducts().then(products=>{
        res.render('admin/products', {
            prods:products,
            pageTitle: 'Admin Products',
            path: '/admin/products',      
          })
     })
    };

exports.postDeleteProduct= (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findAll({where :{id:prodId}})
    .then(product=>{
       return product[0].destroy();
    })
    .then(result=>{console.log('Product Deleted 1'); res.redirect('/admin/products')})
    .catch(err=>{throw err})
    

}