const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '12345@Qwerty', {dialect:'mysql', host:'localhost'})

module.exports = sequelize;