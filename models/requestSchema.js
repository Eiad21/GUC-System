const mongoose = require('mongoose');

const Request=mongoose.Schema({

    date:
    {
        type:Date,
        required:true
    },

    reason:
    {
        type:String
    },

    member:
    {
        type:Number,
        required:true,
        ref:"Member"
    },

    type:
    {
        // leave OR slot_linking OR replacement OR change_day_off
        type:String,
        required:true
    },

    status:
    {
        // pending OR accepted OR rejected
        type:String,
        required:true
    },

    comment:
    {
        type:String
    }
})

  module.exports = mongoose.model('Request',Request);
