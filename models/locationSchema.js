const mongoose = require('mongoose');

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

  
  module.exports = mongoose.model('Location',locationName);