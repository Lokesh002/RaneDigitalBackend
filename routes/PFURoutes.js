const express=require('express');
const PFU=require('../models/PFUModel');
const router=express.Router();
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');

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
        raisingDate:Date.now(),
        actualClosingDate:undefined,
        machine: req.body.machine,
        line:req.body.line,
        raisingPerson:req.body.raisingPerson,
        photoURL:""
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
router.get('/makeBackup',(req,res)=>{
  const srcDir = './public/PFUData';
 // const remoDir='./Backup/PFUData';
  try{
    
   if(!fs.existsSync('./Backup'))  
  {
   fs.mkdirSync('./Backup');
  }
   else{
     
        fse.copySync(srcDir,'./Backup',{overwrite:true,recursive:true});
        res.send({'msg':'Backup Updated.'});
     
   }
}
catch(err){
   console.log(err);
           }

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
        status:0, action:"",rootCause:"", targetDate:undefined
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
          console.log(date);
          var Path='./public/PFUData/'+date.getFullYear().toString();
        //console.log(path);
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
           {header:'Root Cause',key:'rootCause',width:30},
           {header:'Action',key:'action',width:30},
           {header:'Target Date',key:'targetDate',width:20},
           {header:'Status',key:'status',width:10},
           {header:'Actual Closing Date',key:'actualClosingDate',width:20},
           
         ];
         worksheet.addRow([1,docs['raisingDate'],docs['line']['name'],docs['machine']['code'],docs['machine']['name'],docs['raisingDept'],docs['raisingPerson']['genId'],docs['raisingPerson']['username'],docs['problem'],docs['description'],docs['photoURL'],docs['deptResponsible'],docs['rootCause'],docs['action'],docs['targetDate'],docs['status'],
      docs['actualClosingDate']]);
     
     
      workbook.xlsx.writeFile(filePath).then((data)=>{
     
       
     }).catch((err)=>{
       console.log(err);
     });
       //   fs.writeFileSync(filePath,"ajdsabd");
       //   console.log(filePath);
       //   workbook.xlsx.readFile(filePath).then(()=>{
       //     console.log("made file");
       //   }).catch((e)=>{console.log(e);});
       //   workbook.calcProperties.fullCalcOnLoad = true;
       //   workbook.views = [
       //    {
       //      x: 0, y: 0, width: 10000, height: 20000,
       //      firstSheet: 0, activeTab: 1, visibility: 'visible'
       //    }
       //  ];
       //  const sheet = workbook.addWorksheet('Closed PFU', {views:[{state: 'frozen', ySplit:1}]});
     
        }
        else{

          var workbook =new ExcelJS.Workbook();
        //  workbook.creator ="Lokesh Joshi"; 
        console.log((date.getMonth()+1).toString());
        console.log(filePath);
        workbook.xlsx.readFile(filePath)
    .then(function() {
        // use workbook 
        var worksheet;
          worksheet = workbook.getWorksheet('Closed PFU');
          console.log("hehe");
          var sno=worksheet.getCell('A'+worksheet.actualRowCount.toString());
         var x=sno.value +1;
          worksheet.addRow([x,docs['raisingDate'],docs['line']['name'],docs['machine']['code'],docs['machine']['name'],docs['raisingDept'],
          docs['raisingPerson']['genId']
       ,docs['raisingPerson']['username'],docs['problem'],docs['description'],docs['photoURL'],docs['deptResponsible'],docs['rootCause'],docs['action'],docs['targetDate'],docs['status'],
      docs['actualClosingDate']]);
     
      
      workbook.xlsx.writeFile(filePath).then((data)=>{
     
      
     }).catch((err)=>{
       console.log(err);
     });
         //  workbook.xlsx.readFile(filename)
         // .then(function() {
         //     var worksheet = workbook.getWorksheet(sheet);
         //     // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
         //     //   console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
         //     // });
         // });
         // workbook.xlsx.readFile(filePath).then(()=>{
         //   console.log("got file");
        
    });
         // }).catch((e)=>{console.log(e);});  
        }
         
         //const SNo=worksheet.getColumn('s_no');
     
         
        
       
     // Remove the worksheet using worksheet id
     //workbook.removeWorksheet(sheet.id)
        
     }//}
     catch(err){
         console.log(err);
                 }
      res.send(doc);
       
      }).populate('line').populate('machine').populate('raisingPerson');
});
module.exports = router;
