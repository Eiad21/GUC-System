const logList=mongoose.Schema({
    memberId:Number,
    date:{type:Date,
      required:true,
    },
    log:[logObject]
  
  
  
  
  })