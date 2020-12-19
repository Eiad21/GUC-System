const loc=mongoose.Schema({
    locationName:{type:String,
  required:true,
  },
  size:{type:Number,
  required:true,
  },
  locationType:{
  
    type:String,
    required:true,
  
  }
}
  )