const Sequelize=require('sequelize')
const sequelize=require('../util/chat')

const expense=sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },   
    groupname:{
        type:Sequelize.STRING,   
        allowNull:false,
    }  

})

module.exports=expense;