const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');
const shiftDetailsSchema=mongoose.Schema({
    from:{
        type:String,
   
    },
    to:{
        type:String,
    
    },
    hours:{
        type:Number,
 
    }

});
  
const ShiftSchema=mongoose.Schema({
_id:{
    type:Number,
    required:true
}
,
    todayAShift:{
    type:shiftDetailsSchema,
    
},


todayBShift:{
    type:shiftDetailsSchema,
    
},

todayCShift:{
    type:shiftDetailsSchema
},
tommorrowAShift:{
    type:shiftDetailsSchema
},
tommorrowBShift:{
    type:shiftDetailsSchema
},
tommorrowCShift:{
    type:shiftDetailsSchema
},
sameAsToday:{
    type:Boolean,
    
},


},{timestamps:true});
 const shiftDB=mongoose.model('shift',ShiftSchema);
module.exports=shiftDB;