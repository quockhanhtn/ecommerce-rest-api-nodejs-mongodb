const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseSlug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.plugin(mongooseSlug);

const brandSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    brandId: { type: Number },
    name: { type: String, required: true },
    slug: { type: String, slug: "name", slug_padding_size: 2, unique: true },
    description: { type: String, required: false },
    origin: { type: String, required: false },
    image: { type: String, required: false },
    isDelete: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

brandSchema.plugin(mongoosePaginate);
brandSchema.plugin(AutoIncrement, { inc_field: 'brandId' });

module.exports = mongoose.model('Brand', brandSchema);