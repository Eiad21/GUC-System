const mongoose = require('mongoose');


const Course=mongoose.Schema(
    {

    coverage:
    {
        type:Number,
        required:true
    },
  name:
  {
      type:String,
    required:true
  },
  instructors:[Number]
  }
  )

  module.exports = mongoose.model('Course',Course);
