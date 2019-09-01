const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const cartItem = sequelize.define('cart-item',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    quantity: Sequelize.INTEGER
})

module.exports = cartItem;