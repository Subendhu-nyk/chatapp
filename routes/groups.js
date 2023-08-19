const express=require('express')
const router=express.Router()
const chatController=require('../controllers/chat')
const groupController=require('../controllers/groups')
const chatauthentication=require('../middleware/auth')
const path=require('path')
const cors=require('cors');
router.use(cors())
router.use(express.json());

router.post('/chat/creategroup',chatauthentication.authenticate,groupController.postGroupUser)
router.get('/chat/getgroup',chatauthentication.authenticate,groupController.getGroupUser)
// router.post('/chat/postgroup',chatauthentication.authenticate,groupUserController.postGroupUser)

module.exports=router;
