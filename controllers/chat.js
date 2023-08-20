const express=require('express')
const router=express.Router()
const Chat=require('../models/chat')
const User=require('../models/user')
const Usergroup=require('../models/usergroup')
const sequelize=require('../util/chat')
const Sequelize = require('sequelize');
const path=require('path')
const cors=require('cors');
router.use(cors())
router.use(express.json());

exports.userPostChat=async(req,res)=>{
    const transaction=await sequelize.transaction();
    console.log("user>>>>>",req.user)
    if (req.files && req.files.file) {
        const file = req.files.file;
        const s3Params = {
            Bucket: 'S3_BUCKET_NAME',
            Key: Date.now() + '-' + file.name,
            Body: file.data
        };

        const s3Response = await s3.upload(s3Params).promise();
        const fileURL = s3Response.Location;     
    }
    try{
        const message=req.body.message
        const chatId = req.body.chatId
        const groupId = req.body.groupId;
        const recipientId=req.body.recipientId

        console.log("req.body.message>>>>>",)
    
    const chatdata=await Chat.create({
        message:message,
        userId:req.user.id,
        chatId: chatId,
        groupId: groupId,
        recipientId:recipientId
    },{transaction:transaction});
    const user = await User.findByPk(req.user.id);
      if (!user) {
        throw new Error('User not found');
    }

    await transaction.commit() 
   return res.status(201).json({ Message:chatdata });
}
catch(err){
    console.log(err)
    await  transaction.rollback()     
    return res.status(500).json({ error: err }); 
}
}

exports.userGetChat=async (req,res)=>{
    try{
        const chatdata= await Chat.findAll({
            where:{userId:req.user.id}
        })
       return res.status(200).json({allChatData:chatdata})
        console.log("req user>>>>>>",req.user.id)
    }
    catch(err){
        console.log(err)
      return  res.status(500).json({error:err})
    }
}

// exports.getGroupMessages = async (req, res) => {
//     const groupId = req.params.groupId;
//     try {
//         const messages = await Chat.findAll({
//             where: {
//                 groupId: groupId
//             }
//         });
//         res.status(200).json({ messages });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err });
//     }
// }

// exports.getGroupMessages = async (req, res) => {
//     const groupId = req.params.groupId;
//     const userId = req.user.id;
//     try {
//         const messages = await Chat.findAll({
//             where: {
//                 groupId: groupId,
//                 userId: userId
//             },
//             include: [{ model: User, attributes: ['name'] }]
//         });
//         res.status(200).json({ messages:messages });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err });
//     }
// }
exports.getGroupMessages = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user.id; // Current logged-in user's ID

    try {
        // First, check if the user is a member of the group
        const userGroupMembership = await Usergroup.findOne({
            where: {
                groupId: groupId,
                userId: userId
            }
        });

        // If the user is not a member of the group, return an error
        if (!userGroupMembership) {
            return res.status(403).json({ message: "User is not a member of the requested group." });
        }

        const messages = await Chat.findAll({
            where: {
                groupId: groupId
            },
            include: [{ model: User, attributes: ['name'] }]
        });

      return  res.status(200).json({ messages: messages });
    } catch (err) {
        console.log(err);
       return res.status(500).json({ error: err });
    }
}



exports.getChatWithUser = async (req, res) => {
    try {
        const userId = req.user.id; // Current logged-in user's ID
        const otherUserId = req.params.userId; // ID of the other user

        // Fetch messages where current user is the sender and otherUserId is the recipient OR vice versa
        const chatData = await Chat.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { userId: userId, recipientId: otherUserId },
                    { userId: otherUserId, recipientId: userId }
                ]
            },
            order: [['createdAt', 'ASC']] 
        });

        return res.status(200).json({ messages: chatData });
    } catch (err) {
        console.log(err);
      return  res.status(500).json({ error: err });
    }
};