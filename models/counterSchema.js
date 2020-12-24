const mongoose = require('mongoose');

const counterSchema=mongoose.Schema({
    // The counter names are: "acID", "hrID"
    //If you use other counter names please specify them above to avoid confusion`
    counterName:
      {
        type:String,
        required: true
      },

    counterCount:
    {
        type:Number,
        required:true,
    },
    sessions:[signInSessionSchema]  
  
  })

  module.exports.constructor = mongoose.model('counter',counterSchema);
  module.exports.attendanceSchema = attendanceSchema