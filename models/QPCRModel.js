const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

const PartsCheckedSchema=mongoose.Schema({
    partsCheckedAt:{
        type:String
    },
occurringDate:{
        type:String,
    },
segregationDate:{
        type:Date,
    },
    OKqty:{
        type:Number,
    },
    RejectedQtyBeforeRework:{
        type:Number,
    },
    
    SAPqtyToBeChecked:{
        type:Number,
    },
    reworkQty:{
        type:Number,
    },
    reworkOKQty:{
        type:Number,
    },
    remarks:{
        type:String,
    },
    

});

const WhyWhySchema=mongoose.Schema({
    
    problem:{
        type:String,
    },
    occurrenceWhyWhy:{
        type:[],
    },
    detectionWhyWhy:{
        type:[],
    }
});

const detectionStageSchema=mongoose.Schema({
    recieptStage:{
        type:Boolean,
    },
    customerEnd:{
        type:Boolean,
    },
    other:{
        type:String,
    },
    PDI:{
        type:Boolean,
    },
    detectionMachine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},
detectionLine:{type:mongoose.Schema.Types.ObjectId, ref: 'Lines'}


});
const complaintImpactAreasSchema=mongoose.Schema({
    Safety:{
        type:Boolean,
    },
    Fitment:{
        type:Boolean,
    },
    Functional:{
        type:Boolean,
    },
    Visual:{
        type:Boolean,
    },
    Others:{
        type:String,
    }


});

const FishBoneSchema=mongoose.Schema({
    man:{
        type:[],
    },
    machine:{
        type:[],
    },
    method:{
        type:[],
    },
    material:{
        type:[],
    },
    environment:{
        type:[],
    },

});
const ValidationReportSchema=mongoose.Schema({
    cause:{
        type:String,
    },
    specification:{
        type:String,
    },
    isValid:{
        type:Boolean,
    },
    remarks:{
        type:String,
    }
    
});
const MeasuresSchema=mongoose.Schema({
    cause:{
        type:String,
    },
   correctiveMeasures:{
    CMOutflowMeasure:{
        type:Date,
    },
    CMOutflowMeasureTargetDate:{
        type:String,
    },
    CMOutflowResponsibiliy:{
        type:String,
    },
    CMOutflowPhotoURL:{
        type:String,
    },
    CMOccurenceMeasure:{
        type:String,
    },
    CMOccurenceResponsibility:{
        type:String,

    },
    CMOccurrenceMeasureTargetDate:{
        type:Date,
    },
    CMOccurencePhotoURL:{
        type:String,
    }
   },
preventiveMeasures:{
    PMOutflowMeasure:{
        type:String,
    },
    PMOutflowPhotoURL:{
        type:String,
    },
    PMOutflowMeasureTargetDate:{
        type:String,
    },
    PMOutflowResponsibiliy:{
        type:String,
    },
    PMOccurenceMeasure:{
        type:String,
    },
    PMOccurencePhotoURL:{
        type:String,
    },
    PMOccurenceResponsibility:{
        type:String,

    },
    PMOccurrenceMeasureTargetDate:{
        type:Date,
    },
}
    
});

const TeamSchema=mongoose.Schema({
  name:{
      type:String,
  },
    isLeader:{
        type:Boolean
    },
    date:{
        type:Date
    }
    
});

const StandardizationSchema=mongoose.Schema({
 drawingDocNumber:{
     type:String,
 }
 ,PFDDocNumber:{
    type:String,
},FMEADocNumber:{
    type:String,
}
,CPDocNumber:{
    type:String,
}		,
PISDocNumber:{
    type:String,
}	,
SOPDocNumber:{
    type:String,
}	,
FIPDocNumber:{
    type:String,
}	,
FDDocNumber:{
    type:String,
}	,
PSDocNumber:{
    type:String,
}	,
otherStandardization:{
    type:String,
}	

});
const CAPAEffectivenessSchema=mongoose.Schema({
    
    ActionTaken:{
        type:String,
    },
    GRNofFirstLot:{
        type:String,
    },
    dateOfFirstImplementation:{
        type:Date,
    },
    suppliedQty:{
        type:Number,
    },
    acceptedQty:{
        type:Number,
    },
    remarks:{
        type:String,
    }
});
const horizontalDeploymentSchema=mongoose.Schema({
    
    isApplicable:{
        type:Boolean,
    },
    similarProcessOrProductName:
    {
        type:String,
    },
    descOfMeasure:
    {
        type:String,
    },
    targetDate:
    {
        type:Date,
    },
    isEffective:
    {
        type:Boolean,
    },
});
const QPCRSchema=mongoose.Schema({

QPCRNo:{
        type:String,
       /// required:true
    },
partName:{
        type:String,
        required:true
    },
partNumber:{
        type:String,
        required:true
    },
lotCode:{
        type:String,
        
    },
    totalLotQty:{
        type:Number
    },
productionOrderNumber:{
        type:String,
        
    },
    productionOrderQty:{
        type:Number,
       
    },
    manufacturingDate:{
        type:Date,
        
    },
    supplierInvoiceNumber:{
        type:String,
        
    },
    model:{
        type:String,
        required:true
    },
    concernType:{
        type:String,
        required:true
    },
    detectionStage:{
    type:detectionStageSchema,
    required:true
    },

complaintImpactAreas:{
    type:complaintImpactAreasSchema,
    required:true
    },
problem:{
    type:String,
    required:true
},
problemDescription:{
    type:String,
    required:true
},
defectRank:{
    type:String,
    required:true
},
defectiveQuantity:{
    type:Number,
    required:true
},

raisingDept: {
    type:String,
    required:true
},
raisingPerson: {type:mongoose.Schema.Types.ObjectId, ref: 'Users'},
raisingDate:{
    type:Date,
    required:true
},
OKPhotoURL:{
    type:String,
},
NGPhotoURL:{
    type:String,
},

deptResponsible:{
    type:String,
},
targetSubmittingDate:{
    type:Date,  
},

rejectingReason:{
    type:String,
    
},
status:{
    type:Number,
    required:true
},

interimContainmentAction:{
    type:String,
},

segregationDetails:[PartsCheckedSchema],

whyWhyAnalysis:[WhyWhySchema],

fishBoneAnalysis:FishBoneSchema,
validationReport:[ValidationReportSchema],

measures:[MeasuresSchema],
standardization:StandardizationSchema,

teamInvolved:{
    type:[TeamSchema],
},


effectivenessMonitoring:[CAPAEffectivenessSchema],
horizontalDeploymentDetails:[horizontalDeploymentSchema],

submissionDate:{
    type:Date,
},
actualClosingDate:{
    type:Date,
    
},
submissionRejectingReason:{
    type:String,
},


acceptingPerson:{
    type:String,
    
},


},{timestamps:true});
 const QPCRdb=mongoose.model('QPCR',QPCRSchema);
module.exports=QPCRdb;