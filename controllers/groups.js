const groupUser=require('../models/groups')
const userGroup=require('../models/usergroup')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},'98sh856ru454t45izklk')
  }

const postGroupUser=async(req,res)=>{
    try{        
        const groupname=req.body.groupname
        const createdby=req.user.name
        const members = req.body.members;   
       console.log("this is groupname>>>",groupname)
       console.log("this is groupuser>>>",createdby)
       console.log("this is groupMEMBERS>>>",members)
        if(groupname===undefined||groupname.length===0 || !members || members.length === 0)
        {
            return res.status(400).json({message:"Bad parameters or something is missing"})
        }      

        const data=await groupUser.create({
            groupname:groupname, 
            createdby:createdby         

        });

        const groupID = data.id;
        const userGroupData = members.map(userId => ({
            groupId: groupID,
            userId: userId
        }));
       const groupdta= await userGroup.bulkCreate(userGroupData);

        console.log("this is groupdata>>>",data)
        res.status(200).json({message:'new user created'})
   
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"some error",err})
    }
}

const getGroupUser = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have the user's ID in the request
        console.log("User ID:", userId);

        const userGroups = await userGroup.findAll({ where: { userId } });
        console.log("User Groups:", userGroups);

        const groupIds = userGroups.map(userGroup => userGroup.groupId);
        const groups = await groupUser.findAll({ where: { id: groupIds } });
        console.log("groups>>>>",groups)

        res.status(200).json({ allGroupData: groups });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Some error", err });
    }
};




module.exports={
  postGroupUser,getGroupUser
}
