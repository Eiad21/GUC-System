const mongoose = require('mongoose');

const memberSchema=require('./memberSchema').member;
const { courseSlotSchema }=require('./courseSlotSchema');

const courseSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  coverage:
  {
    type:Number,
    required:true
  },
  coordiantorID:{
    type:String,
    required:true
  },
  coordinatorName:{
    type:String,
    required:true
  },
  instructors:[memberSchema],
  TAs:[memberSchema],
  courseSchedule:[courseSlotSchema]
})

  module.exports.constructor = mongoose.model('course',courseSchema);
  module.exports.courseSchema = courseSchema
