const mongoose = require('mongoose');

//  GUC Staff Members
const memberSchema = mongoose.Schema({
    name:
    {
        type:String,
        required:true,
    },

    memberId:
    {
        type:String,
        required:true,
    },
    
    Facultyname:
    {
        type:String,
        required:true,
        ref:"Faculty"   // is this correct?
    },

    department:
    {
        type:String,
        required:true,
    },

    email:{
        type:String,
        unique:true,
        required:true,
    },

    password:{
        type:String,
        required:true,

    },

    schedule:[slot]
});

module.exports = mongoose.model('Member',memberSchema);
