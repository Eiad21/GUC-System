const mongoose = require('mongoose');

const { courseSlotSchema }=require('./courseSlotSchema');

const courseSchema=mongoose.Schema({
  courseName:{
    type:String,
    required:true,
    unique:true
  },
  facultyName:{
    type:String
  },
  departmentName:{
    type:String
  },
  assignedCount:
  {
    type:Number,
    required:true
  },
  coordinatorID:{
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
    },
    mail:{
      type:String,
      required:true
    },
    office:{
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
    },
    mail:{
      type:String,
      required:true
    },
    office:{
      type:String,
      required:true
    }
  }],
  courseSchedule:[courseSlotSchema]
})



  module.exports.constructor = mongoose.model('course',courseSchema);
  module.exports.courseSchema = courseSchema
