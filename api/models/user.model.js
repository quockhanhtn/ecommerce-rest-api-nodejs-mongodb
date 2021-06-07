const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,

  email: {
    type: String,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: {email: {$type: 'string'}}
    }
  },
  phone: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: {phone: {$type: 'string'}}
    }
  },
  password: { type: String, required: true, trim: true },

  userType: { type: String, default: 'custommer', required: true },
  image: { type: String, required: false }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);