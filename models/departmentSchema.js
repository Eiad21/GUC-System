const mongoose = require('mongoose');

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
    //course:[courseSchema]
   });

module.exports = mongoose.model('department',departmentSchema);
