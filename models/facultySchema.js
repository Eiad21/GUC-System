const mongoose = require('mongoose');
const departmentSchema=require('./departmentSchema').Dep;
// FACULTY
const facultySchema=new mongoose.Schema({
   facultyName:
        {type:String,
        unique:true,
        required:true,
        },
   deanID:
        {type:String,
        required:true,
        },
   deanName:
        {type:String,
        required:true,
        },

    departments: [departmentSchema]
  });
  
  module.exports.constructor = mongoose.model('Faculty',facultySchema);
  module.exports.Faculty = facultySchema