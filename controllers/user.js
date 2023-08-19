const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')




function isstringinvalid(string){
    if(string==undefined || string.length===0){
        return true;
    }
    else{
        return false;
    }
}

const postUser=async(req,res)=>{
    try{

        const name=req.body.name;
        const email=req.body.email
        const phone=req.body.phone
        const password=req.body.password        
        console.log(name,email,phone,password)
        if(name===undefined||name.length===0 ||email===undefined||email.length===0 ||phone===undefined||phone.length===0 ||password===undefined||password.length===0  )
        {
            return res.status(400).json({message:"Bad parameters or something is missing"})
        }

        let saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{

        const data=await User.create({
            name:name,
            email:email,
            phone:phone,
            password:hash,

        });
        console.log(data)
        res.status(200).json({message:'new user created'})
    })
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"some error",err})
    }
}

function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},'98sh856ru454t45izklk')
  }



const getUser=async (req,res)=>{
    try{
        const{email,password}=req.body     
   
        if(isstringinvalid(email)||isstringinvalid(password)){
            return res.status(400).json({message:'email or id is missing',success:false})
        }
        const user=await User.findOne({where:{email}})        
            if(user){ 
                
                bcrypt.compare(password,user.password,(err,result)=>{
                    if(err){
                        throw new Error('something went wrong in bcrypt comparision')
                    }
                    if(result===true){
                        return res.status(200).json({success:true,message:'user logged in successfully',token:generateAccessToken(user.id,user.name)});
                    }
                    else{
                        return res.status(400).json({success:false,message:'password is incorrect'})
                    }
                })          
        }else
        {
            return res.status(200).json({success:false,message:'user doesnt exist'})
        }                    

    }
    catch(err){
        res.status(500).json({message:err,success:false})
    }
}

const getAllUser=async(req,res)=>{
    try{
    const user=await User.findAll()
    return res.status(200).json({success:true,allUserData:user});
    }
    catch(err){
        console.log(err)
    }
}


module.exports={
  postUser,getUser,generateAccessToken,getAllUser
}


