const express=require('express')
const router=express.Router()
const chatController=require('../controllers/chat')
const Chat=require('../models/chat')
const User=require('../models/user')
const sequelize=require('../util/chat')
const chatauthentication=require('../middleware/auth')
const path=require('path')
const cors=require('cors');
router.use(cors())
router.use(express.json());
router.use(express.static(path.join(__dirname,'public')))
router.use(express.static(path.join(__dirname,'public','html')))


router.get('/chat',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','html','chat.html'))
})

router.post('/chat',chatauthentication.authenticate,chatController.userChat)


module.exports=router;
