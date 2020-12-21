const mongoose = require('mongoose');

const { courseSlotSchema }=require('./courseSlotSchema');

const courseSchema=mongoose.Schema({
  courseName:{
    type:String,
    required:true,
    unique:true
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

  instructors:[{
    id:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }
}],

  TAs:[{
    id:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }
}],
  courseSchedule:[courseSlotSchema]
})

  module.exports.constructor = mongoose.model('course',courseSchema);
  module.exports.courseSchema = courseSchema
