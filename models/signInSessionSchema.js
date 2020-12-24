const mongoose = require('mongoose');

const signInSessionSchema = mongoose.Schema({
    // which should be required
    sessionId:  {
        type: Number,
        required:true
        },
    timein:  {
    type: Date
    },
    
    timeout:{
        type: Date 


    }
    
    
    })

  module.exports.constructor = mongoose.model('signInSession',signInSessionSchema);
  module.exports.signInSessionSchema = signInSessionSchema