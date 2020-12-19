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

  
  module.exports.constructor = mongoose.model('Location',loc);
  module.exports.loc = loc