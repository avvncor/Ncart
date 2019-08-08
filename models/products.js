//const products = [];
const fs = require('fs')
const path = require('path')
const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');

const  getProductsFromFile =  function(cb) {
    fs.readFile(p,(err,fileContent)=>{
        if(err){
         return   cb([])
        }
         cb(JSON.parse(fileContent))        
    })
}

module.exports = class Product {
    constructor(title){
        this.title = title
    }

    save(){
       // products.push(this)
       getProductsFromFile (products=>{
        products.push(this) 
        fs.writeFile(p,JSON.stringify(products),(err)=>{
            console.log(err)
        })
       })
       fs.readFile(p,(err,fileContent)=>{ 
       })
    }

    static fetchAll (cb){
        getProductsFromFile(cb)
    }
}
