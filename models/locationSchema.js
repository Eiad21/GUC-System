const mongoose = require('mongoose');

const locationSchema=mongoose.Schema(
  {
    locationName:
    {
      type:String,
      required:true,
      unique:true
    },

  capacity:
  {
    type:Number,
    required:true,
  },

  population:
  {
    type:Number
  },

  // ACCEPTABLE TYPES: Office, Tutorial, Lab, Lecture_Hall, Exam_Hall
  locationType:
  {
    type:String,
    required:true
  }
})

  
  module.exports.constructor = mongoose.model('Location',locationSchema);
  module.exports.locationSchema = locationSchema