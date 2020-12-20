const mongoose = require('mongoose');
const logObject=require('./logObjectSchema').logObject;

const logList=mongoose.Schema({
    memberId:Number,
    date:{type:Date,
      required:true,
    },
    log:[logObject]
  
  
  
  
  })

  module.exports.constructor = mongoose.model('logList',logList);
  module.exports.logList = logList