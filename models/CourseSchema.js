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

  module.exports.constructor = mongoose.model('Course',Course);
  module.exports.Course = Course
