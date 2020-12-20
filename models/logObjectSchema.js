const mongoose = require('mongoose');

const logObject=mongoose.Schema({
    timein:  {
    type: Date,
      required: true
    },
    
    timeout:{
        type: Date 


    }
    
    
    })

  module.exports.constructor = mongoose.model('LogObject',logObject);
  module.exports.logObject = logObject