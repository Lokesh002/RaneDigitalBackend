const express=require('express');
const User=require('../models/UserModel');
const router=express.Router();
const adminPass='lokesh';
router.post('/verifyAdmin', (req,res)=>{


    const genId=req.body.genId;
    const password=req.body.password;
    if(genId=='14076'&& password=='lokesh')
{
    res.send({"allowed":true});
}
else{
    User.findOne({genId:genId}).then((result)=>{
        if(result!=null){
            if(password==result["password"])
        {
            if(result["accountType"]=="admin"){
                res.send({"allowed":true});
            }
            else{
                res.send({"allowed":false});
            }

        }
        else{
            res.status(404).send("Invalid Password");
        }
        }
        else{res.status(404).send("User not Found");}
    }).catch((err)=>{
        res.status(404).send("User not Found");
        console.log(err);});
}

});
router.post('/deleteAccount/:userId',async (req,res)=>{
const userId= req.params.userId;

User.findByIdAndDelete(userId,(err,result)=>{
    if(err) 
    
    {console.log(err);
    res.status(404).send("Error Occured");
        return;
    
    }
    else{
        
        res.status(200).send("Successfully Deleted");}})
    }
    
);

router.post('/registerUser', (req,res)=>{
    const username=req.body.username;
    const accountType=req.body.accountType;
    const password=req.body.password;
    const department=req.body.department;
    const genId=req.body.genId;
    const accessDept=req.body.accessDept;
    var access;
    switch(accountType){
        case "admin":
            access={
                pfu:true,
            cssEdit:true,
            cssView:true,
            qssEdit:true,
            cssVerify:true,
            qssVerify:true,
            qssView:true,
            qssAdd:true,
            cssAdd:true,
            addNewUser:true,
            accessDept:accessDept}
        break;
        case "staff":
            access={
                pfu:true,
            cssEdit:true,
            cssView:true,
            qssEdit:true,
            qssView:true,
            cssVerify:false,
            qssVerify:false,
            qssAdd:false,
            cssAdd:false,
            addNewUser:false,
            accessDept:accessDept}
        break;
        case "lineLeader":
            access={
                pfu:true,
            cssEdit:false,
            cssView:true,
            qssEdit:false,
            cssVerify:true,
            qssVerify:true,
            qssView:true,
            qssAdd:false,
            cssAdd:false,
            addNewUser:false,
            accessDept:accessDept}
        break;   
        case "operator":
            access={
                pfu:true,
            cssEdit:false,
            cssView:true,
            qssEdit:false,
            cssVerify:false,
            qssVerify:false,
            qssView:true,
            qssAdd:true,
            cssAdd:true,
            addNewUser:false,
            accessDept:accessDept}
        break;
        default:
            access=false;
            res.status(404).send("Account Type not Found");
            return;
           
    }

if(access)
{   User.find({genId:genId}).then((result)=>{
    if(result.length!=0)
    {
        res.status(404).send("User already exists");
        return;

    }
    else{
        const newUser= new User({
            genId:genId,
            username:username,
            department:department,
            password:password,
            accountType:accountType,
            access:access
        });
       
        newUser.save().then((result)=>{res.send(result);}).catch((err)=>{console.log(err);
            res.status(500).send(err);
            });
    }
});
    
}
  

});

router.post('/getUser', (req,res)=>{
    const genId=req.body.genId;
    const password=req.body.password;
    
    User.findOne({genId:genId}).then((result)=>{
        if(result!=null){
            if(password==result["password"])
        {
            res.send(result);
        }
        else{
            res.status(404).send("Invalid Password");
        }
        }
        else{res.status(404).send("User not Found");}
    }).catch((err)=>{
        res.status(404).send("User not Found");
        console.log(err);});
});
router.post('/changeDept',(req,res)=>{
    const userID=req.body.userId;
    const newDept=req.body.newDepartment;
    User.findByIdAndUpdate(userID,{
      department:newDept,
      
    },{ "new": true, "upsert": true }, function(err,doc){
        if(err) 
        {
          res.status(500).send("Error!");
          console.log(err);
      }
        res.send(doc);
        
      });

});
router.post('/changePassword', (req,res)=>{
    const userId=req.body.userId;
    const newPassword=req.body.newPassword;
    
    User.findByIdAndUpdate(userId,{
        password:newPassword
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });

});


router.get('/getAllUsers',(req,res)=>{
    User.find().select('genId username department accountType').then((result)=>{
        if(result==null){
        res.status(404).send("Error");
        }
        else{
           res.send(result);
        }
        
    }).catch((err)=>{
        res.status(404).send("Users not Present");
        console.log(err);});
})
module.exports = router;

