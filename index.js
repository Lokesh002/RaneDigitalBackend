

// RUN PACKAGES
  const mongoose = require("mongoose");
  const express = require('express');
  const multer = require('multer');
  const bodyParser = require('body-parser');
  const fs=require('fs');
const path =require('path');
const CSSRoutes=require('./routes/CSSRoutes');
const QSSRoutes=require('./routes/QSSRoutes');
const PFURoutes=require('./routes/PFURoutes');
const LineRoutes=require('./routes/LineRoutes');
const UserAuthRoute=require('./routes/UserAuthRoute');
const FourMRoutes=require('./routes/FourMRoutes');
const DailyProduction=require('./routes/DailyMFGRoutes');
const ShiftPlan=require('./routes/ShiftPlanRoutes');
const ejs=require('ejs');
const PFU=require('./models/PFUModel');
const FileDB = require("./models/uploadedFile");
const FolderDB=require("./models/newFolder");
const { doesNotMatch } = require("assert");
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//DB connect and server start

mongoose.connect('mongodb://localhost/RaneDMS',{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false  })
.then((result)=>{console.log('Connection to DB has been made.');
app.listen(port,function(){
  console.log(`Server listening on port ${port}`);
});
}).catch((err)=>{console.log(err)});


var x='';
var photoName="";
//Set Storage Engine
const storage=multer.diskStorage({
destination: './public/uploads/',
filename:async function(req,file,cb){
   x=file.fieldname+"_"+Date.now()+path.extname(file.originalname);
   await cb(null,x);
   
}
});
const picsStorage=multer.diskStorage({
  destination: './public/PFUpics/',
  filename:async function(req,file,cb){
     photoName=file.fieldname+"_"+Date.now()+path.extname(file.originalname);
     await cb(null,photoName);
     
  }
  });


//Init Upload
const upload=multer({
      
    storage:storage,
    
  limits:{
      fileSize: 500* 1024 * 1024
  }
}).single('myfile');
//PFU photo
const uploadPFUPhoto=multer({
      
  storage:picsStorage,
  
limits:{
    fileSize: 10* 1024 * 1024
}
}).single('myPhoto');



// SETUP APP
var data;

  app.use(express.static('./public'));
    app.get('/', (req,res)=>{
     
              res.render('index',{success:""}); 
                                    
        
    });   
    app.delete('/updateApp',(req,res)=>{
      res.send('1.0.0');
    })
    app.get('/MEDDropDown.json', (req,res)=>{
      FolderDB.find({department:"MED"}).then((result)=>{
        
        data=result;

        res.send(JSON.stringify(data));
        
        }).catch((err)=>{console.log(err);});
    });
    app.get('/StoreDropDown.json', (req,res)=>{
      FolderDB.find({department:"Store"}).then((result)=>{
        store=result;
        res.send(JSON.stringify(result));
        }).catch((err)=>{console.log(err);});
    });
    app.get('/PPCDropDown.json', (req,res)=>{
      FolderDB.find({department:"PPC"}).then((result)=>{
        store=result;
        res.send(JSON.stringify(result));
        }).catch((err)=>{console.log(err);});
    });
    app.get('/MFGDropDown.json', (req,res)=>{
      FolderDB.find({department:"MFG"}).then((result)=>{
        store=result;
        res.send(JSON.stringify(result));
        }).catch((err)=>{console.log(err);});
    });
    app.get('/PLEDropDown.json', (req,res)=>{
      FolderDB.find({department:"PLE"}).then((result)=>{
        store=result;
        console.log("hello"+ result);
        res.send(JSON.stringify(result));
        }).catch((err)=>{console.log(err);});
    });
    app.get('/QADDropDown.json', (req,res)=>{
      FolderDB.find({department:"QAD"}).then((result)=>{
        store=result;
        res.send(JSON.stringify(result));
        }).catch((err)=>{console.log(err);});
    });

        
//using routes
    app.use('/CSS',CSSRoutes);
    app.use('/QSS', QSSRoutes);
    app.use('/PFU', PFURoutes);
    app.use('/Line', LineRoutes);
    app.use('/User', UserAuthRoute);
    app.use('/4M', FourMRoutes);
    app.use('/DailyProduction', DailyProduction);
    app.use('/ShiftPlan', ShiftPlan);


//post UPLOAD FILE method
    app.post('/upload',(req,res)=>{
        
        upload(req,res,(err) =>{
        //   console.log(req.body.myList);
        // console.log(req.body.name);
        
            if(err){
                res.render('index',{msg:err,success:""});

            }else{
              
                // console.log(req.file);
                FileDB.find({
                  department:req.body.myList,
                  originalName:req.file.originalname
                })
                .then(async(result)=>{
                    // console.log(result);
                    if(result.length==0){
                      
                      if(req.body.folderList=="newFolder"){
                        var foldernm=req.body.folderName;
                        var folder;
                        
                        // console.log("hello "+foldernm);
                        // console.log(req.body.folderList);

                        //saving folder
                        const folderDB=new FolderDB({
                          name:req.body.folderName.toString(),
                          department: req.body.myList
                          
                        });
                        // console.log("folderDB");
                        // console.log(folderDB);
                        await folderDB.save().then((result)=>{
                          // console.log(result);
                           folder=result;
                        
                        }).catch((err)=>{console.log(err);}); 
                        
                        
                        //Saving file
                        const fileDB=new FileDB({
                          name: req.body.name.toString(),
                          originalName:req.file.originalname.toString(),
                          //CHANGE THIS WHEN DEPLOYING TO MFG
                          url: 'http://192.168.43.18:3000/uploads/'+x,
                          department: req.body.myList,
                          folder: folder._id,
                          size: req.file.size
                         });
                         
                         fileDB.save().then((result)=>{ res.render('index',{success: "File Uploaded Succesfully!"});}).catch((err)=>{console.log(err);}); 
                        

                      }

                      //else save file in already saved folder
                     else{
                      var selectedFolder=req.body.folderList;
                      const fileDB=new FileDB({
                        name: req.body.name.toString(),
                        originalName:req.file.originalname.toString(),
                        //CHANGE THIS WHEN DEPLOYING TO MFG
                        url: 'http://192.168.43.18:3000/uploads/'+x,
                        department: req.body.myList,
                        folder: mongoose.Types.ObjectId(req.body.folderList),
                        size: req.file.size
                       });
                       fileDB.save().then((result)=>{res.render('index',{success: "File Uploaded Succesfully!"});}).catch((err)=>{console.log(err);}); 
                     } 
                      
                      
                }
                else{
                //change the url of existing file in DB and then delete the earlier file.
                
                var url=result[0]["url"];
                // console.log(url);
                var y="./public"+url.toString().substring(25);
                // console.log(y);
                fs.unlink(y, function(err)  {
                  if(err){
                    console.log(err);
                  } 
                });
                  console.log("file deleted");

                  mongoose.set('useFindAndModify', false);
                   FileDB.findOneAndUpdate({department:req.body.myList,
                    originalName:req.file.originalname}, {url:url.toString().substring(0,33)+"/"+x
                    },{upsert:true}, function(err,doc){
                      if(err) throw err;
                      // console.log("haha");
                      // console.log(doc);
                      
                    });


                //   fs.unlink('sample.txt', function (err) {
                //     if (err) throw err;
                //     // if no error, file has been deleted successfully
                //     console.log('File deleted!');
                // }); 
                res.render('index',{success: "File Already Present. Replaced Succesfully!"});
                 
                }
                }).catch((err)=>{
                  console.log(err);
                    res.status(404).send("Error found");
                });
                  
                
              
            }
        });
    });

    app.post('/uploadPFUPhoto',(req,res)=>{
        
      uploadPFUPhoto(req,res,(err) =>{
        // console.log(req.body.pfuId);
      
          if(err){
              res.send("Error");

          }
          else{
            
              //console.log(req.file);
              PFU.findByIdAndUpdate(req.body.pfuId,{
                photoURL:'http://192.168.43.18:3000/PFUpics/'+photoName
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
               
        //get files of a folder method
app.get('/apk',(req,res)=>{
  res.redirect('/app/RaneDigital.apk');
  }); 
        //get files of a folder method
app.get('/view/:folder',(req,res)=>{
  const folder= req.params.folder;
  // console.log(folder);
  FileDB.find({
    
    folder:folder.toString()
  }).then((result)=>{
      res.send(result);
     
  }).catch((err)=>{
      res.status(404).send("Folder not found");
      
  }); 
    
  });
      
         

//get folders of a department method
app.get('/:dept',(req,res)=>{
  const dept= req.params.dept;
  // console.log(dept);
  FolderDB.find({
    department:dept.toString()
  
  })
  .then((result)=>{
      res.send(result);
      
    }).catch((err)=>{
      res.status(404).send("Department not found");
      
  });
});


    
   
  