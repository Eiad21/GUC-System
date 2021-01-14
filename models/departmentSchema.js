const mongoose = require('mongoose');
const courseSchema=require('./CourseSchema').courseSchema;
const memberSchema=require('./memberSchema').member;

// department schema
const departmentSchema=new mongoose.Schema({
    departmentName:{
        type:String,
        required:true,
      },
      facultyName:{
        type:String
      },
    headID:{ 
        type:String,
        required:true,
      },
    headName:{
      type:String,
      required:true,
    },
    courses:[courseSchema],
    staff:[{
        id:{
          type:String,
          required:true
        },
        name:{
          type:String,
          required:true
        },
        MemberRank:{type:String,
          required:true
      },
        mail:{
          type:String,
          required:true
        },
        office:{
          type:String,
          required:true
        },
        dayoff:{
          type:String,
          required:true
        }
      }]
  });


   module.exports.constructor = mongoose.model('Department',departmentSchema);
   module.exports.Dep = departmentSchema;
