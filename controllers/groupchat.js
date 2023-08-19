const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


// function generateAccessToken(id,name){
//     return jwt.sign({userId:id,name:name},'98sh856ru454t45izklk')
//   }


const getAllUser=async (req,res)=>{
    try{
        const groupUser=await User.findAll()   
        res.status(200).json({ allUser: groupUser});                     

    }
    catch(err){
        res.status(500).json({message:err,success:false})
    }
}


module.exports={
  getAllUser
}
