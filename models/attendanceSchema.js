const mongoose = require('mongoose');
const { signInSessionSchema }=require('./signInSessionSchema');

const attendanceSchema=mongoose.Schema({
    memberId:
      {
        type:String,
        required: true
      },
    date:{type:Date,
      required:true,
    },
    sessions:[signInSessionSchema]  
  
  })

  module.exports.constructor = mongoose.model('attendance',attendanceSchema);
  module.exports.attendanceSchema = attendanceSchema