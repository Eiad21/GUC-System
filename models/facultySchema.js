const mongoose = require('mongoose');

// FACULTY
const facultySchema=new mongoose.Schema({
    facultyName:
            {type:String,
            required:true,
            },
    deanID:
            {type:String,
            required:true,
            },
   // departments: [departmentSchema]
  });

  module.exports = mongoose.model('Faculty',facultySchema);
  