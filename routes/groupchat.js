const express=require('express')
const router=express.Router()
const chatController=require('../controllers/chat')
const groupController=require('../controllers/groupchat')

const chatauthentication=require('../middleware/auth')
const path=require('path')
const cors=require('cors');
router.use(cors())
router.use(express.json());

router.get('/chat/group',groupController.getAllUser)

module.exports=router;
