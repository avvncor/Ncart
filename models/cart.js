const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice){
        //fetching the previous cart
        fs.readFile(p,(err, fileContent)=>{
            let cart = { products:[], totalPrice:0}
            if(!err){
                cart = JSON.parse(fileContent)
            }  
        // analyzing cart and finding existing product       
         const existingProductIndex =  cart.products.findIndex(prod=>prod.id===id);
         const existingProduct =  cart.products[existingProductIndex]
        //add new product / increase quantity
            let updatedProduct;   
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                updatedProduct = {id:id, qty:1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice);
           
            fs.writeFile(p,JSON.stringify(cart),err=>{
                console.log(err)
            })
        })
    
    }
}


//Cart.addProduct('3','27')

