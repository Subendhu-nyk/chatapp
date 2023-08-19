const Sequelize=require('sequelize')
const sequelize=require('../util/chat')

const usergroup=sequelize.define('usergroup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },   
})

module.exports=usergroup;