const jwt=require('jsonwebtoken')
const User=require('../models/user')

const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization')
        const user=jwt.verify(token,'98sh856ru454t45izklk');
        User.findByPk(user.userId).then(user=>{
            req.user=user;
            next();
        }).catch(err=>{throw new Error(err)})
    }
    catch(err){
        console.log("error"+err)
        return res.status(400).json({success:fail})
    }
}

module.exports={
    authenticate
}