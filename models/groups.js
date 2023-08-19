const Sequelize=require('sequelize')
const sequelize=require('../util/chat')

const group=sequelize.define('group',{
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
    },  
    createdby:{
        type:Sequelize.STRING, 
        allowNull:false,  
       
    }
})

module.exports=group;