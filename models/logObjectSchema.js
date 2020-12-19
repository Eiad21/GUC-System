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

    
  
  module.exports = mongoose.model('LogObject',logObject);