const express=require('express')
const router=express.Router()
const path=require('path')
const userController=require('../controllers/user')
const bodyParser=require('body-parser')
router.use(express.json());
const cors=require('cors');
router.use(cors())
router.use(express.static(path.join(__dirname,'public')))
router.use(express.static(path.join(__dirname,'public','html')))
router.use(bodyParser.urlencoded({extended:false}))


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','html','index.html'))
})

router.post('/user/signup',userController.postUser)

router.post('/user/login',userController.getUser)


module.exports=router