const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,

  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  // gender 0 = male; 1 = female; 2 = other
  gender: { type: Number, default: 3, required: false },

  email: {
    type: String,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } }
    }
  },
  phone: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { phone: { $type: 'string' } }
    }
  },
  password: { type: String, required: true, trim: true },

  userType: { type: String, default: 'custommer', required: true },
  firebaseUid: { type: String },
  image: { type: String, required: false }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);