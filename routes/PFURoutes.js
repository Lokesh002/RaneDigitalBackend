const express=require('express');
const PFU=require('../models/PFUModel');
const router=express.Router();
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');
const e = require('express');

//Generate PFU

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
        raisingDate:new Date(Date.now()+(5*60*60*1000+30*60*1000)),
        actualClosingDate:undefined,
        machine: req.body.machine,
        line:req.body.line,
        raisingPerson:req.body.raisingPerson,
        photoURL:"",
        impactProd: req.body.impactProd,
        impactQual: req.body.impactQual,
        impactCost: req.body.impactCost,
        impactDisp: req.body.impactDisp,
        impactSafe: req.body.impactSafe,
        impactMora: req.body.impactMora,
        impactEnvi: req.body.impactEnvi,
        acceptingPerson:'',
        rejectingReason:'',
        closingRemarks: ''
    });
    pfu.save().then((result)=>{result.populate('machine').populate('raisingPerson',function(err, pfu) {
      if(err) throw err;

      
      
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
    const impactProd=req.body.impactProd;
    const impactQual=req.body.impactQual;
    const impactCost= req.body.impactCost;
    const impactDisp=req.body.impactDisp;
    const impactSafe= req.body.impactSafe;
    const impactMora= req.body.impactMora;
    const impactEnvi= req.body.impactEnvi;
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
   if(impactProd)
   {
query.impactProd=true;
   }
   else{
   }

   if(impactQual)
   {
query.impactQual=true;
   }
   else{
   }
   if(impactCost)
   {
query.impactCost=true;
   }
   else{
   }
   if(impactDisp)
   {
query.impactDisp=true;
   }
   else{
   }
   if(impactSafe)
   {
query.impactSafe=true;
   }
   else{
   }
   if(impactMora)
   {
query.impactMora=true;
   }
   else{
   }
   if(impactEnvi)
   {
query.impactEnvi=true;
   }
   else{

   }
   

PFU.find(query).populate('line').populate('machine').populate('raisingPerson').then((pfu)=>{

  res.send(pfu)}).catch((err)=>{res.status(404).send("  ")});
    
});
router.post('/acceptPFU', (req,res)=>{
    const pfuId=req.body.pfuId;
   const acceptingPerson=req.body.acceptingPerson;
    PFU.findByIdAndUpdate(pfuId,{
        status:1, acceptingPerson:acceptingPerson
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
   
});
router.get('/makeBackup',(req,res)=>{
  const srcDir = './public/PFUData';
 // const remoDir='./Backup/PFUData';
  try{
    
   if(!fs.existsSync('./Backup'))  
  {
   fs.mkdirSync('./Backup')
    fs.mkdirSync('./Backup/PFU');
  
   }
   else{
     if(!fs.existsSync('./Backup/PFU'))
     {
      fs.mkdirSync('./Backup/PFU');
     }
     
        fse.copySync(srcDir,'./Backup/PFU',{overwrite:true,recursive:true});
        res.send({'msg':'Backup Updated.'});
     
   }
}
catch(err){
   console.log(err);
           }

});

router.post('/rejectPFU', (req,res)=>{
    const pfuId=req.body.pfuId;
   const rejectingReason=req.body.rejectingReason;
    PFU.findByIdAndUpdate(pfuId,{
        status:6,
        rejectingReason:rejectingReason
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
   var photo;
   
    PFU.findByIdAndDelete(pfuId,(err,result)=>{
        if(err) 
        
        {console.log(err);
        res.status(404).send("Error Occured");
            return;
        
        }
        else{
          
              photo=result['photoURL'].toString();
            
           if(fs.existsSync('./public/PFUpics/'+photo.substring(34,59)))
           {
             fs.unlinkSync('./public/PFUpics/'+photo.substring(34,59));
           }
            res.status(200).send("Successfully Deleted");
        }
    });

});
router.post('/reSubmitPFU', (req,res)=>{
    const pfuId=req.body.pfuId;
   
    PFU.findByIdAndUpdate(pfuId,{
        status:0, action:"",rootCause:"", targetDate:undefined,
        acceptingPerson:'', closingRemarks:'', rejectingReason:''
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
const action=req.body.action;


    PFU.findByIdAndUpdate(pfuId,{
        status:2, action:action,rootCause:rootCause, targetDate:new Date(targetDate)
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
   const remarks=req.body.closingRemarks;
    PFU.findByIdAndUpdate(pfuId,{
        status:4,
        closingRemarks:remarks
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
          
        });
});


router.post('/changePFUDetails',(req,res)=>{
  const pfuId=req.body.pfuId;
  const rootCause=req.body.rootCause;
const targetDate=req.body.targetDate;
const action=req.body.action;

   PFU.findByIdAndUpdate(pfuId,{
        action:action,rootCause:rootCause, targetDate:new Date(targetDate)
       },{ "new": true, "upsert": true }, function(err,doc){
         if(err) 
         {
           res.status(500).send("Error!");
           console.log(err);
       }
         res.send(doc);
         
       });
})

router.post('/PFUClose', (req,res)=>{
  const pfuId=req.body.pfuId;
 const actualClosingDate=new Date(req.body.actualClosingDate);
  PFU.findByIdAndUpdate(pfuId,{
      status:5, actualClosingDate:actualClosingDate
      },{ "new": true, "upsert": true }, function(err,doc){
        if(err) 
        {
          res.status(500).send("Error!");
          console.log(err);
        }      
        var docs=doc;
        try{
          var date=new Date();
          var Path='./public/PFUData/'+date.getFullYear().toString();
       
         if(!fs.existsSync(Path))  
        {
         fs.mkdirSync(Path);
        }
         var filePath=Path+'/'+(date.getMonth()+1).toString()+'.xlsx';
       //  //Workbook code start
       //  //mandatory
         
        if(!fs.existsSync(filePath))
        {
          var workbook = new ExcelJS.Workbook();
        workbook.creator ="Lokesh Joshi"; 
        var worksheet;
         worksheet = workbook.addWorksheet('Closed PFU');
         worksheet.columns=[
           {header:'S.No.',key:'s_no',width:10},
            {header:'Raising Date',key:'raisingDate',width:20},
           {header:'Line',key:'line',width:20}, 
           {header:'Machine Code',key:'machineCode',width:10}, 
           {header:'Machine Name',key:'machineName',width:20},
           {header:'Raising Department',key:'raisingDept',width:10},
            {header:'Raising Person GenId',key:'raisingPersonGenId',width:10},
            {header:'Raising Person Name',key:'raisingPersonName',width:20},
            {header:'Problem',key:'problem',width:30},
           {header:'Problem Description',key:'description',width:40},
           {header:'Photo URL',key:'photoURL',width:40},
           {header:'Responsible Department',key:'deptResponsible',width:10},
           {header:'PFU Accepted By',key:'acceptingPerson',width:20},
           {header:'Root Cause',key:'rootCause',width:30},
           {header:'Action',key:'action',width:30},
           {header:'Target Date',key:'targetDate',width:20},
           {header:'Status',key:'status',width:10},
           {header:'Effect on Production',key:'impactProd',width:10},
           {header:'Effect on Quality',key:'impactQual',width:10},
           {header:'Effect on Cost',key:'impactCost',width:10},
           {header:'Effect on Dispatch',key:'impactDisp',width:10},
           {header:'Effect on Safety',key:'impactSafe',width:10},
           {header:'Effect on Morale',key:'impactMora',width:10},
           {header:'Effect on Environment',key:'impactEnvi',width:10},
           {header:'Actual Closing Date',key:'actualClosingDate',width:20},
           {header:'Closing Remarks/Doc No',key:'closingRemarks',width:40}
         ];
         worksheet.addRow([1,docs['raisingDate'],docs['line']['name'],docs['machine']['code'],docs['machine']['name'],docs['raisingDept'],docs['raisingPerson']['genId'],docs['raisingPerson']['username'],docs['problem'],docs['description'],docs['photoURL'],docs['deptResponsible'],docs['acceptingPerson'],docs['rootCause'],docs['action'],docs['targetDate'],docs['status'],docs['impactProd'],docs['impactQual'],docs['impactCost'],docs['impactDisp'],docs['impactSafe'],docs['impactMora'],docs['impactEnvi'],docs['actualClosingDate'],docs['closingRemarks']]);
     
     
      workbook.xlsx.writeFile(filePath).then((data)=>{
     
       
     }).catch((err)=>{
       console.log(err);
     });
       
        }
        else{

          var workbook =new ExcelJS.Workbook();
        
        workbook.xlsx.readFile(filePath)
    .then(function() {
        // use workbook 
        var worksheet;
          worksheet = workbook.getWorksheet('Closed PFU');

          var sno=worksheet.getCell('A'+worksheet.actualRowCount.toString());
         var x=sno.value +1;
          worksheet.addRow([x,docs['raisingDate'],docs['line']['name'],docs['machine']['code'],docs['machine']['name'],docs['raisingDept'],
          docs['raisingPerson']['genId'],docs['raisingPerson']['username'],docs['problem'],docs['description'],docs['photoURL'],docs['deptResponsible'],docs['acceptingPerson'],docs['rootCause'],docs['action'],docs['targetDate'],docs['status'],docs['impactProd'],docs['impactQual'],docs['impactCost'],docs['impactDisp'],docs['impactSafe'],docs['impactMora'],docs['impactEnvi'],docs['actualClosingDate'],docs['closingRemarks']]);
     
      
      workbook.xlsx.writeFile(filePath).then((data)=>{
     
      
     }).catch((err)=>{
       console.log(err);
     });
         
        
    });
         
        }
         

        
     }
     catch(err){
         console.log(err);
                 }
      res.send(doc);
       
      }).populate('line').populate('machine').populate('raisingPerson');
});
module.exports = router;
