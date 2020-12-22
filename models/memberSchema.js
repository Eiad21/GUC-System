const mongoose = require('mongoose');
const {slotSchema} = require('./slotSchema');

//  GUC Staff Members
const memberSchema = mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    //male or female
    gender:{
        type:String,
        required:true
    },
    memberId:
    {
        type:String,
        required:true,
    },
    
    FacultyName:
    {
        type:String,
//        required:true,
        // let's check for referencing
 //       ref:"Faculty"   // is this correct?
    },

    departmentName:
    {
        type:String,
//        required:true,
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
    salary:{
        type:Number
    },
    officeLocation:{
        type:String
    },
    MemberRank:
    {
        locationType:String,
        

    },
    schedule:[slotSchema]
});

module.exports.constructor = mongoose.model('Member',memberSchema);
module.exports.member = memberSchema