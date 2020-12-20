const mongoose = require('mongoose');

const locationSchema=mongoose.Schema(
  {
    locationName:
    {
      type:String,
      required:true,
    },

  capacity:
  {
    type:Number,
    required:true,
  },

  locationType:
  {
    type:String,
    required:true
  }
})

  
  module.exports.constructor = mongoose.model('Location',locationSchema);
  module.exports.locationSchema = locationSchema