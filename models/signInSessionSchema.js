const mongoose = require('mongoose');

const signInSessionSchema = mongoose.Schema({
    // which should be required
    timein:  {
    type: Date
    },
    
    timeout:{
        type: Date 


    }
    
    
    })

  module.exports.constructor = mongoose.model('signInSession',signInSessionSchema);
  module.exports.signInSessionSchema = signInSessionSchema