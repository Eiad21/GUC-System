const mongoose = require('mongoose');
const courseSchema=require('./CourseSchema').Course;

// department schema
const departmentSchema=new mongoose.Schema({
    departmentName:{
        type:String,
        required:true,
      },
    headID:{  // one to one ? then schema but its better to avoid anomalies
        type:Number,
        required:true,
      },
    course:[courseSchema]
   });


   module.exports.constructor = mongoose.model('Department',departmentSchema);
   module.exports.Dep = departmentSchema
