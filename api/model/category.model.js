const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const categorySchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, required: true },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: false,
    default: null
  },
  isPrimary: { type: Boolean, required: true, default: false },
  image: { type: String, required: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
categorySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Category', categorySchema);