const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseSlug = require('mongoose-slug-generator');

mongoose.plugin(mongooseSlug);

const productSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    slug: { type: String, slug: "name", slug_padding_size: 6, unique: true },
    description: { type: String, required: false },

    marketPrice: Number,
    price: Number,
    thumbnail: { type: String, required: false },

    categoryId: { type: String, required: false, default: 0 },
    brandId: { type: String, required: false, default: 0 },
  },
  { timestamps: true }
);
productSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Product', productSchema);