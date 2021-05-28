const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseSlug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.plugin(mongooseSlug);

const categorySchema = mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
  slug: { type: String, slug: "name", slug_padding_size: 2, unique: true },
  description: { type: String, required: false },

  parent: { type: Number, ref: 'Category', required: false, default: null },
  isPrimary: { type: Boolean, required: true, default: false },
  image: { type: String, required: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDelete: { type: Boolean, required: true, default: false },
}, { _id: false });

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(AutoIncrement);


module.exports = mongoose.model('Category', categorySchema);