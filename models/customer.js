const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

const Customer = sequelize.define("customer",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

 function generateAuthToken (id) { 
    const token = jwt.sign({ _id: id }, process.env.JWT_PRIVATE_KEY);
    return token;
  }

module.exports= {Customer,generateAuthToken};