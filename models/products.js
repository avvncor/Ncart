var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId, ref:'User',
        required:true
    }
})

module.exports = mongoose.model('Product', productSchema,'Product');
