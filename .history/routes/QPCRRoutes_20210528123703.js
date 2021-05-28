const express=require('express');
const QPCR=require('../models/QPCRModel');
const router=express.Router();
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');
const e = require('express');

const multer = require('multer');
  const bodyParser = require('body-parser');

const path =require('path');
var finalURL='http://192.168.0.200:3000/';
//Generate QPCR
var qpcrOKPhoto="";
var qpcrNGPhoto="";
var qpcrEvidencePhoto="";

const picsQPCROKStorage=multer.diskStorage({
  destination: './public/QPCRpics/QpcrOKPics/',
  filename:async function(req,file,cb){
     qpcrOKPhoto=file.fieldname+"_"+Date.now()+path.extname(file.originalname);
     await cb(null,qpcrOKPhoto);
     
  }
  });
  const picsQPCRNGStorage=multer.diskStorage({
    destination: './public/QPCRpics/QpcrNGPics/',
    filename:async function(req,file,cb){
       qpcrNGPhoto=file.fieldname+"_"+Date.now()+path.extname(file.originalname);
       await cb(null,qpcrNGPhoto);
       
    }
    });
    const picsQPCREvidenceStorage=multer.diskStorage({
      destination: './public/QPCRpics/QpcrEvidencePics/',
      filename:async function(req,file,cb){
         qpcrEvidencePhoto=file.fieldname+"_"+Date.now()+path.extname(file.originalname);
         await cb(null,qpcrEvidencePhoto);
         
      }
      });

      const uploadQpcrOKPhoto=multer({
      
        storage:picsQPCROKStorage,
        
      limits:{
          fileSize: 10* 1024 * 1024
      }
      }).single('myQPCROKPhoto');
      const uploadQpcrNGPhoto=multer({
            
        storage:picsQPCRNGStorage,
        
      limits:{
          fileSize: 10* 1024 * 1024
      }
      }).single('myQPCRNGPhoto');
      
      const uploadQpcrEvidencePhoto=multer({
            
        storage:picsQPCREvidenceStorage,
        
      limits:{
          fileSize: 10* 1024 * 1024
      }
      }).single('myQPCREvidencePhoto');
 
      
      router.post('/uploadQpcrOKPhoto',(req,res)=>{
        
        uploadQpcrOKPhoto(req,res,(err) =>{
          // console.log(req.body.pfuId);
        
            if(err){
                res.send(err);
  
            }
            else{
              
                //console.log(req.file);
                QPCR.findByIdAndUpdate(req.body.QPCRId,{
                  OKPhotoURL:finalURL+'QPCRpics/QpcrOKPics/'+qpcrOKPhoto
                  },{ "new": true, "upsert": true }, function(err,doc){
                    if(err) 
                    {
                      res.status(500).send("Error!");
                      console.log(err);
                  }
                    res.send(doc);
                    
                  });
                      } 
                });
               
                
     }); 
         
      router.post('/uploadQpcrNGPhoto',(req,res)=>{
          
        uploadQpcrNGPhoto(req,res,(err) =>{
          // console.log(req.body.pfuId);
        
            if(err){
                res.send("Error");
            }
            else{
              
                //console.log(req.file);
                QPCR.findByIdAndUpdate(req.body.QPCRId,{
                NGPhotoURL:finalURL+'QPCRpics/QpcrNGPics/'+qpcrNGPhoto
                  },{ "new": true, "upsert": true }, function(err,doc){
                    if(err) 
                    {
                      res.status(500).send("Error!");
                      console.log(err);
                  }
                    res.send(doc);
                  });
                      }   
                });
     });       
  
     router.post('/uploadQpcrEvidencePhoto',(req,res)=>{
       const newQPCR=req.body.newQPCR;
      uploadQpcrEvidencePhoto(req,res,(err) =>{
        // console.log(req.body.pfuId);
          if(err){
              res.send("Error");
          }
          else{
              //console.log(req.file);
              QPCR.findByIdAndUpdate(req.body.QPCRId,
                newQPCR,
  
                // {
                // photoURL:finalURL+'QPCRpics/QpcrEvidencePics/'+qpcrEvidencePhoto
                // }
                { "new": true, "upsert": true }, function(err,doc){
                  if(err) 
                  {
                    res.status(500).send("Error!");
                    console.log(err);
                }
                  res.send(doc); 
                });
                }
              });      
            });
      
      
router.post('/generate', (req,res)=>{
  
  
  function getQPCRNo(raisingDepartment) {
  var query={};
  
      query.createdAt={ "$gte": new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1,0,0,0), "$lt": new Date(Date.now())};
       query.raisingDept=raisingDepartment;
  

       var x;
  
   QPCR.find(query).lean().select('_id').then((nqpcr)=>{
    //console.log(nqpcr);

    var Number=(nqpcr.length+1).toString().length>1?(nqpcr.length+1).toString():'0'+(nqpcr.length+1).toString();
   
    var month=(new Date(Date.now()+(5*60*60*1000+30*60*1000)).getMonth()+1).toString().length>1?(new Date(Date.now()+(5*60*60*1000+30*60*1000)).getMonth()+1).toString():'0'+(new Date(Date.now()+(5*60*60*1000+30*60*1000)).getMonth()+1).toString();
    var year=new Date(Date.now()+(5*60*60*1000+30*60*1000)).getFullYear().toString().substring(2,4);
    x=raisingDepartment+'/'+month+'/'+year+'0'+Number;
    console.log('QPCR '+x+' is raised.');
    const qpcr=new QPCR({
      QPCRNo: x,
      partName:req.body.partName,
      partNumber:req.body.partNumber,
      lotCode:req.body.lotCode,
      totalLotQty:req.body.totalLotQty,
      problem:req.body.problem,
      productionOrderNumber:req.body.productionOrderNumber,
      productionOrderQty:req.body.productionOrderQty,
     manufacturingDate:new Date(req.body.manufacturingDate),
      supplierInvoiceNumber:req.body.supplierInvoiceNumber,
      model:req.body.model,
      concernType:req.body.concernType,
      detectionStage:{
        recieptStage:req.body.recieptStage,
        customerEnd:req.body.customerEnd,
        other:req.body.otherDet,
        PDI:req.body.PDI,
        detectionMachine:req.body.detectionMachine,
        detectionLine:req.body.detectionLine,
      },
      complaintImpactAreas:req.body.complaintImpactAreas,
      problemDescription:req.body.problemDescription,
      defectRank:req.body.defectRank,
      defectiveQuantity:req.body.defectiveQuantity,
      raisingDept:req.body.raisingDepartment,
      raisingPerson: req.body.raisingPerson,
      raisingDate:req.body.raisingDate,
      OKPhotoURL:req.body.OKPhotoURL,
      NGPhotoURL:req.body.NGPhotoURL,
      deptResponsible:req.body.departmentResponsible,
      status:0
      });
      qpcr.save().then((result)=>{result.populate('raisingPerson',function(err, qpcr) {
        if(err) throw err;
          res.send(qpcr);
      });}).catch((err)=>{
        res.status(404).send("Error");
        console.log(err);
      }); 
    
    }).catch((err)=>{res.status(404).send("Nothing Found")});
    
}
getQPCRNo(req.body.raisingDepartment);
  
});

//get A QPCR
router.post('/getQPCR', (req,res)=>{
  const qpcrId=req.body.qpcrId;
QPCR.findById(qpcrId).lean().populate('raisingPerson','username genId department').populate('detectionStage.detectionMachine','name code').populate('detectionStage.detectionLine','name').then((qpcr)=>{

res.send(qpcr);

}).catch((err)=>{res.status(404).send("Nothing Found")});
});
// FILTER LIST OF QPCR SHORT
router.post('/getQPCRListShort', (req,res)=>{
  const fromDate=req.body.fromDate;
  const toDate=req.body.toDate;
  const status=req.body.status;
  const departmentResponsible=req.body.departmentResponsible;
  const raisingDepartment=req.body.raisingDepartment;
 
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

  if(status=='open')
  {
      query.status={$lt:3};
  }
 else
 {
  if(status=='closed')
  { 
   query.status=3; 
    
  }else
  {
    if(status=='mineOpen')
  { 
   query.status={ $in: [0,1,2,3,4,6] }; 
  }
  }
 }
// QPCR.find(query).lean().select('QPCRNo problem defectRank raisingDate raisingPerson status deptResponsible raisingDept partName concernType').populate('raisingPerson','username genId department').populate('detectionStage.detectionMachine','name code').populate('detectionStage.detectionLine','name').then((qpcr)=>{
  QPCR.find(query).lean().select('QPCRNo problem defectRank raisingDate raisingPerson status deptResponsible raisingDept partName concernType').populate('raisingPerson','username genId department').then((qpcr)=>{

res.send(qpcr);

}).catch((err)=>{res.status(404).send("Nothing Found")});
});

//Filter QPCRs Long
router.post('/getQPCRListLong', (req,res)=>{
    const fromDate=req.body.fromDate;
    const toDate=req.body.toDate;
    const status=req.body.status;
    const departmentResponsible=req.body.departmentResponsible;
    const raisingDepartment=req.body.raisingDepartment;
   // const detectionStage=req.body
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

    if(status=='open')
    {
        query.status={$lt:3};
    }
   else
   {
    if(status=='closed')
    { 
     query.status=3; 
      
    }else
    {
      if(status=='mineOpen')
    { 
     query.status={ $in: [0,1,2,3,4,6] }; 
    }
    }
   }
QPCR.find(query).lean().populate('raisingPerson','username genId department').populate('detectionStage.detectionMachine','name code').populate('detectionStage.detectionLine','name').then((qpcr)=>{

  res.send(qpcr);

}).catch((err)=>{res.status(404).send("Nothing Found")});
});




router.post('/acceptQPCR', (req,res)=>{
    const qpcrId=req.body.qpcrId;
    const targetDate=req.body.targetDate;
   const acceptingPerson=req.body.acceptingPerson;
    QPCR.findByIdAndUpdate(qpcrId,{
        status:1, acceptingPerson:acceptingPerson, targetSubmittingDate:targetDate
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
  const srcDir = './public/QPCRData';

  try{
    
   if(!fs.existsSync('./Backup'))  
  {
   fs.mkdirSync('./Backup')
    fs.mkdirSync('./Backup/QPCR');
  
   }
   else{
     if(!fs.existsSync('./Backup/QPCR'))
     {
      fs.mkdirSync('./Backup/QPCR');
     }
     
        fse.copySync(srcDir,'./Backup/QPCR',{overwrite:true,recursive:true});
        res.send({'msg':'Backup Updated.'});
     
   }
}
catch(err){
   console.log(err);
           }

});



router.post('/rejectQPCR', (req,res)=>{
    const qpcrId=req.body.qpcrId;
   const rejectingReason=req.body.rejectingReason;
    QPCR.findByIdAndUpdate(qpcrId,{
        status:4,
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

router.delete('/deleteQPCR/:qpcrId',(req,res)=>{
    const qpcrId=req.params.qpcrId;
   var OKphoto;
   var NGphoto;
    QPCR.findByIdAndDelete(qpcrId,(err,result)=>{
        if(err) 
        {console.log(err);
        res.status(404).send("Error Occured");
            return;
        }
        else{
              OKphoto=result['OKphotoURL'].toString();
              NGphoto=result['NGphotoURL'].toString();
              
           if(fs.existsSync('./public/QPCRpics/QpcrOKPics/'+OKphoto.substring(46,65)))
           {
             fs.unlinkSync('./public/QPCRpics/QpcrOKPics/'+OKphoto.substring(46,65));
           }
           if(fs.existsSync('./public/QPCRpics/QpcrNGPics/'+NGphoto.substring(46,65)))
           {
             fs.unlinkSync('./public/QPCRpics/QpcrNGPics/'+NGphoto.substring(46,65));
           }
            res.status(200).send("Successfully Deleted");
        }
    });
});

router.post('/reSubmitQPCR', (req,res)=>{
    const qpcrId=req.body.qpcrId;
    QPCR.findByIdAndUpdate(qpcrId,{
        status:0,
        targetDate:undefined,
        acceptingPerson:'', 
        closingRemarks:'',
        rejectingReason:''
        },{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send(doc);
        });
        QPCR.findByIdAndUpdate()
});
//QPCR SAVE STEP ONE: TEMPORARY ACTION & SEGREGATION DETAILS
router.post('/QPCRSave', (req,res)=>{
  const qpcrId=req.body.newQPCR['_id'];
  const newQPCR=req.body.newQPCR;
  // const interimContainmentAction=req.body.temporaryAction;
  // const segregationDetails=req.body.segregationDetails;
  QPCR.findByIdAndUpdate(qpcrId,newQPCR,{ "new": true, "upsert": true }, function(err,doc){
        if(err) 
        {
          res.status(500).send("Error!");
          console.log(err);
      }
        res.send(doc);
        
      }).populate('raisingPerson','username genId department').populate('detectionStage.detectionMachine','name code').populate('detectionStage.detectionLine','name');
});
// // QPCR SAVE STEP TWO: FISH BONE ANALYSIS
// router.post('/QPCRSaveStepTwo', (req,res)=>{
//     const qpcrId=req.body.lastSavedQPCR['_id'];
//     const lastSavedQPCR=req.body.lastSavedQPCR;
//     // var validationReport=[];
//     // for(var i=0;i<lastSavedQPCR['fishBoneAnalysis']['man'].length;i++)
//     // {
//     //   var validation;
//     //   validation={
//     //   cause:lastSavedQPCR['fishBoneAnalysis']['man'][i],
//     //   specification:lastSavedQPCR['validationReport'][]['specification'],
//     //   isValid:lastSavedQPCR['validationReport']['isValid'],
//     //   remarks:''
//     //   }
//     //   validationReport.push(validation); 
//     // }
//     // for(var i=0;i<lastSavedQPCR['fishBoneAnalysis']['machine'].length;i++)
//     // {
//     //   var validation;
//     //   validation={
//     //   cause:lastSavedQPCR['fishBoneAnalysis']['machine'][i],
//     //   specification:'',
//     //   isValid:undefined,
//     //   remarks:''
//     //   }
//     //   validationReport.push(validation);
      
//     // }
//     // for(var i=0;i<lastSavedQPCR['fishBoneAnalysis']['method'].length;i++)
//     // {
//     //   var validation;
//     //   validation={
//     //   cause:lastSavedQPCR['fishBoneAnalysis']['method'][i],
//     //   specification:'',
//     //   isValid:undefined,
//     //   remarks:''
//     //   }
//     //   validationReport.push(validation);
      
//     // }
//     // for(var i=0;i<lastSavedQPCR['fishBoneAnalysis']['material'].length;i++)
//     // {
//     //   var validation;
//     //   validation={
//     //   cause:lastSavedQPCR['fishBoneAnalysis']['material'][i],
//     //   specification:'',
//     //   isValid:undefined,
//     //   remarks:''
//     //   }
//     //   validationReport.push(validation);
      
//     // }
//     // for(var i=0;i<lastSavedQPCR['fishBoneAnalysis']['environment'].length;i++)
//     // {
//     //   var validation;
//     //   validation={
//     //   cause:lastSavedQPCR['fishBoneAnalysis']['environment'][i],
//     //   specification:'',
//     //   isValid:undefined,
//     //   remarks:''
//     //   }
//     //   validationReport.push(validation);
//     // }
//     QPCR.findByIdAndUpdate(qpcrId,lastSavedQPCR,{ "new": true, "upsert": true }, function(err,doc){
//           if(err) 
//           {
//             res.status(500).send("Error!");
//             console.log(err);
//         }
//           res.send(doc);
          
//         });
// });

// //QPCR SAVE STEP THREE: VALIDATION REPORT
// router.post('/QPCRSaveStepThree', (req,res)=>{
//   const qpcrId=req.body.newQPCR['_id'];
//   const newQPCR=req.body.newQPCR;
//   //var whyWhy=[];

//   // for(var i=0;i<validationReport.length;i++){
//   //   if(validationReport[i]['isValid'])
//   //   {
//   //     var map={
//   //       id:i,
//   //       problem:validationReport[i]['cause'],
//   //       occurenceWhyWhy:validationReport[i]['occurenceWhyWhy'],
//   //     detectionWhyWhy:[]
//   //     }
//   //     whyWhy.push(map);
//   //   }
//   // }
//   QPCR.findByIdAndUpdate(qpcrId,newQPCR,{ "new": true, "upsert": true }, function(err,doc){
//         if(err) 
//         {
//           res.status(500).send("Error!");
//           console.log(err);
//       }
//         res.send(doc);
        
//       });
// });

// //QPCR SAVE STEP FOUR: WHY WHY ANALYSIS
// // router.post('/QPCRSaveStepFour', (req,res)=>{
// //   const qpcrId=req.body.QPCRId;
// //   const validationReport=req.body.validationReport;
  
// //   QPCR.findByIdAndUpdate(qpcrId,{
// //       validationReport:validationReport
// //       },{ "new": true, "upsert": true }, function(err,doc){
// //         if(err) 
// //         {
// //           res.status(500).send("Error!");
// //           console.log(err);
// //       }
// //         res.send(doc);
        
// //       });
// // });

// // QPCR SHOW ALL VALID CAUSES
// // router.get('/QPCRShowValidCauses', (req,res)=>{
// //   const qpcrId=req.body.qpcrId;
// //   QPCR.findById(qpcrId).then((qpcr)=>{
// //     res.send(qpcr['whyWhyAnalysis']);
// //     }).catch((err)=>{res.status(404).send("error")});
// // });

// // QPCR SAVE EACH WHY WHY
// router.get('/QPCRSaveStepFour', (req,res)=>{
//   const qpcrId=req.body.newQPCR['_id'];
//   const newQPCR=req.body.newQPCR;
//   // const isOccurence=req.body.isOccurence;
//   // const causeId=req.body.causeId;
//   // const whyWhy=req.body.whyWhy;
//   // var dataBaseWhyWhy;
//   // if(isOccurence)
//   // {
//   //   QPCR.findById(qpcrId).then((qpcr)=>{
//   //        dataBaseWhyWhy=qpcr['whyWhyAnalysis'];
//   //         }).catch((err)=>{res.status(404).send("error")});

//   //         for(var i=0;i<dataBaseWhyWhy.length;i++)
//   //         {
//   //           if(dataBaseWhyWhy[i]['id']==causeId)
//   //           {
//   //             dataBaseWhyWhy[i]['occurenceWhyWhy']=whyWhy;
//   //           }
//   //         }
    
//   // }
//   // else{
//   //   QPCR.findById(qpcrId).then((qpcr)=>{
//   //     dataBaseWhyWhy=qpcr['whyWhyAnalysis'];
//   //      }).catch((err)=>{res.status(404).send("error")});

//   //      for(var i=0;i<dataBaseWhyWhy.length;i++)
//   //      {
//   //        if(dataBaseWhyWhy[i]['id']==causeId)
//   //        {
//   //          dataBaseWhyWhy[i]['detectionWhyWhy']=whyWhy;
//   //        }
//   //      }
 
//   // }
//   QPCR.findByIdAndUpdate(qpcrId,newQPCR,{ "new": true, "upsert": true }, function(err,doc){
//       if(err) 
//       {
//         res.status(500).send("Error!");
//         console.log(err);
//     }
//       res.send(doc);
//     });
// });



// router.post('/changeQPCRDetails',(req,res)=>{
//   const qpcrId=req.body.qpcrId;
//   const rootCause=req.body.rootCause;
// const targetDate=req.body.targetDate;
// const action=req.body.action;

//    QPCR.findByIdAndUpdate(qpcrId,{
//         action:action,rootCause:rootCause, targetDate:new Date(targetDate)
//        },{ "new": true, "upsert": true }, function(err,doc){
//          if(err) 
//          {
//            res.status(500).send("Error!");
//            console.log(err);
//        }
//          res.send(doc);
         
//        });
// })
router.post('/QPCRSubmit', (req,res)=>{
  const qpcrId=req.body.qpcrId;
  const submissionDate=req.body.submissionDate;
  const newQPCR=req.body.newQPCR;
  QPCR.findByIdAndUpdate(qpcrId,newQPCR,{ "new": true, "upsert": true }, function(err,doc){
    if(err) 
    {
      res.status(500).send("Error!");
      console.log(err);
  }
    
  QPCR.findByIdAndUpdate(qpcrId,{status:2,submissionDate:submissionDate},{ "new": true, "upsert": true }, function(err,doc){
    if(err) 
    {
      res.status(500).send("Error!");
      console.log(err);
  }
    res.send(doc);
    
  });
  });
  
});


router.post('/QPCRClose', (req,res)=>{
  const qpcrId=req.body.qpcrId;
 const actualClosingDate=new Date(req.body.actualClosingDate);
  QPCR.findByIdAndUpdate(qpcrId,{
      status:3, actualClosingDate:actualClosingDate
      },{ "new": true, "upsert": true }, function(err,docs){
        if(err) 
        {
          res.status(500).send("Error!");
          console.log(err);
        }      
        
        try{
          var date=new Date();
          var Path='./public/QPCRData/'+date.getFullYear().toString();
       
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
         worksheet = workbook.addWorksheet('Closed QPCR');
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
           {header:'QPCR Accepted By',key:'acceptingPerson',width:20},
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
          worksheet = workbook.getWorksheet('Closed QPCR');

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
