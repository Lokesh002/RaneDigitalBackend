const express=require('express');
const PFU=require('../models/PFUModel');
const router=express.Router();
//Generate PFu
router.post('/generate', (req,res)=>{
    const pfu=new PFU({
        problem: req.body.problem.toString(),
        description:req.body.description.toString(),
        raisingDept: req.body.raisingDepartment.toString(),
        deptResponsible: req.body.departmentResponsible.toString(),
        status:0,
        rootCause:"",
        targetDate:undefined,
        action:"",
        raisingDate:Date.now(),
        actualClosingDate:undefined,
        machine: req.body.machine,
        line:req.body.line,
        raisingPerson:req.body.raisingPerson,
    });
    pfu.save().then((result)=>{result.populate('machine').populate('raisingPerson',function(err, pfu) {
      if(err) throw err;

      
      console.log(result);
        res.send(pfu);
    });}).catch((err)=>{
      res.status(404).send("Error");
      console.log(err);
    }); 
});

//Filter PFUs

router.post('/getPFU', (req,res)=>{
    const fromDate=req.body.fromDate;
    const toDate=req.body.toDate;
    const status=req.body.status;
    const departmentResponsible=req.body.departmentResponsible;
    const raisingDepartment=req.body.raisingDepartment;
    const machineId=req.body.machineId;
    const lineId=req.body.lineId;

    
    
    var query={};

    if(fromDate)

    {
        query.createdAt={ "$gte": new Date(fromDate), "$lt": new Date(toDate)};
        }

    if(departmentResponsible)
    {
      if(departmentResponsible!='ALL')
      {
        query.deptResponsible=departmentResponsible;
    
      }
        }

    if(raisingDepartment)
    {
      if(raisingDepartment!='ALL')
    {    query.raisingDept=raisingDepartment;
    }}
if(machineId)
{
    query.machine=machineId;
}
if(lineId)
{
    query.line=lineId;
}
    if(status=='open')
    {
        query.status={$lt:4};
    }
   else
   {
    if(status=='closed')
    { 
     query.status=5; 
      
    }else
    {
      if(status=='mineOpen')
    { 
     query.status={ $in: [0,1,2,3,4,6] }; 
    }
    }
    
   }
   

PFU.find(query).populate('line').populate('machine').populate('raisingPerson').then((pfu)=>{
  console.log(query);
  res.send(pfu)}).catch((err)=>{res.status(404).send("  ")});
    
});
router.post('/acceptPFU', (req,res)=>{
    const pfuId=req.body.pfuId;
   
    PFU.findByIdAndUpdate(pfuId,{
        status:1
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
   
});
router.post('/rejectPFU', (req,res)=>{
    const pfuId=req.body.pfuId;
   
    PFU.findByIdAndUpdate(pfuId,{
        status:6
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
});
router.delete('/deletePFU/:pfuId',(req,res)=>{
    const pfuId=req.params.pfuId;
   
    PFU.findByIdAndDelete(pfuId,(err,result)=>{
        if(err) 
        
        {console.log(err);
        res.status(404).send("Error Occured");
            return;
        
        }
        else{
           
            res.status(200).send("Successfully Deleted");
        }
    });

});
router.post('/reSubmitPFU', (req,res)=>{
    const pfuId=req.body.pfuId;
   
    PFU.findByIdAndUpdate(pfuId,{
        status:0
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
});
router.post('/PFUActionDecide', (req,res)=>{
    const pfuId=req.body.pfuId;
   const rootCause=req.body.rootCause;
const targetDate=req.body.targetDate;


    PFU.findByIdAndUpdate(pfuId,{
        status:2, rootCause:rootCause, targetDate:new Date(targetDate)
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
});
router.post('/PFUActionDone', (req,res)=>{
    const pfuId=req.body.pfuId;
   
    PFU.findByIdAndUpdate(pfuId,{
        status:3
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
});
router.post('/PFUStandardize', (req,res)=>{
    const pfuId=req.body.pfuId;
   
    PFU.findByIdAndUpdate(pfuId,{
        status:4
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
});
router.post('/PFUClose', (req,res)=>{
  const pfuId=req.body.pfuId;
 
  PFU.findByIdAndUpdate(pfuId,{
      status:5
      },{ "new": true, "upsert": true }, function(err,doc){
        if(err) 
        {
          res.status(500).send("Error!");
          console.log(err);
      }
        res.send(doc);
        
      });
});
module.exports = router;
