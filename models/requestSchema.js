const mongoose = require('mongoose');

const requestSchema=mongoose.Schema({

    date:
    {
        type:Date,
        required:true
    },

    reason:
    {
        type:String
    },
    content:{
        type:String
    },
    sender:
    {
        type:String,
        required:true,
      // let's check about referencing
        //  ref:"Member"
    },
    reciever:
    {
        type:String,
        required:true,
      // let's check about referencing
        //  ref:"Member"
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

  module.exports.requestModel = mongoose.model('Request',requestSchema);
  module.exports.requestSchema = requestSchema;
