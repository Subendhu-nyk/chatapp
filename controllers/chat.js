const express=require('express')
const router=express.Router()
const Chat=require('../models/chat')
const User=require('../models/user')
const sequelize=require('../util/chat')
const path=require('path')
const cors=require('cors');
router.use(cors())
router.use(express.json());

exports.userPostChat=async(req,res)=>{
    const transaction=await sequelize.transaction();
    console.log("user>>>>>",req.user)
    try{
        const message=req.body.message
        const chatId = req.body.chatId
        console.log("req.body.message>>>>>",req.body.message)
    
    const chatdata=await Chat.create({
        message:message,
        userId:req.user.id,
        chatId: chatId
    },{transaction:transaction});
    const user = await User.findByPk(req.user.id);
      if (!user) {
        throw new Error('User not found');
    }

    await transaction.commit() 
    res.status(201).json({ Message:chatdata });
}
catch(err){
    console.log(err)
    await  transaction.rollback()     
    res.status(500).json({ error: err }); 
}
}

exports.userGetChat=async (req,res)=>{
    try{
        const chatdata= await Chat.findAll({
            where:{userId:req.user.id}
        })
        res.status(200).json({allChatData:chatdata})
        console.log("req user>>>>>>",req.user.id)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}