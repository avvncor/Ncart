var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema ({
   
   name:{
       type:String,
       required:true
   },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[
            {
                productId:{type:Schema.Types.ObjectId,ref:'Product', required:true},
                quantity:{type:Number, required:true}
            }
        ]
    }
})

userSchema.methods.addToCart = function(product){

  const  pIndex = this.cart.items.findIndex(index=>{
        return index.productId.toString()=== product._id.toString()
    });

    let newQuantity = 1;
    var updatedItems = [...this.cart.items]

    if(pIndex>=0){
        newQuantity = this.cart.items[pIndex].quantity + 1 ;
        updatedItems[pIndex].quantity = newQuantity;

    }else{
        updatedItems.push({
            productId: product._id,
            quantity:newQuantity
        })
    }

    const updatedCart = {
        items: updatedItems
    }

    this.cart = updatedCart;
    this.save()
}

userSchema.methods.deleteItemFromCart  = function (id){
    const updatedItems = this.cart.items.filter(items=> {
        return items.productId.toString() !== id.toString()
    })
    this.cart.items = updatedItems;

   return  this.save()
}

userSchema.methods.clearCart = function (){
    this.cart.items = [];
    this.save()
}
module.exports = mongoose.model('User',userSchema,'User')