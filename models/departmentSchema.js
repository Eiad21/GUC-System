const mongoose = require('mongoose');
const courseSchema=require('./CourseSchema').Course;
const memberSchema=require('./memberSchema').member;

// department schema
const departmentSchema=new mongoose.Schema({
    departmentName:{
        type:String,
        required:true,
      },
    headID:{ 
        type:String,
        required:true,
      },
    headName:{
      type:String,
      required:true,
    },
    course:[courseSchema],
    staff:[memberSchema]
   });


   module.exports.constructor = mongoose.model('Department',departmentSchema);
   module.exports.Dep = departmentSchema;
