const mongoose = require('mongoose');

const logList=mongoose.Schema({
    memberId:Number,
    date:{type:Date,
      required:true,
    },
    log:[logObject]
  
  
  
  
  })

  
  
  module.exports = mongoose.model('LogList',logList);