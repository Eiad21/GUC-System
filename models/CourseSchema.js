const mongoose = require('mongoose');
const MemberSchema = require('./members');


const Course=mongoose.Schema(
    {

    coverage:
    {
        type:Float,
        required:true
    },
  name:
  {
      type:String,
    required:true
  },
  instructors:[MemberSchema.memberId]
  }
  )

  module.exports = mongoose.model('Course',Course);
