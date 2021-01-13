const mongoose = require('mongoose');
const { signInSessionSchema }=require('./signInSessionSchema');

const attendanceSchema=mongoose.Schema({
    memberId:
      {
        type:String,
        required: true
      },
      memberName:
      {
        type:String
      },  
    date:{type:Date, // year, month, day OR Number and the result of get time in case that == does not gets the value of
      required:true,
    },
    sessions:[signInSessionSchema],
    missingMinutes: // will be for both missing/ extra hours
    {
      type:Number,
      default:504
    },
    missedDay:
    {
      type:Boolean
    } 
  
  })

  module.exports.constructor = mongoose.model('attendance',attendanceSchema);
  module.exports.attendanceSchema = attendanceSchema