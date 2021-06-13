const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseSlug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.plugin(mongooseSlug);

const productSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    productId: { type: Number },

    name: { type: String, required: true },
    slug: { type: String, slug: "name", slug_padding_size: 6, unique: true },
    description: { type: String, required: false },

    marketPrice: Number,
    price: Number,

    productTypes: [String],

    thumbnail: { type: String, required: false },
    images: [String],

    category: { type: Number, ref: 'Category' },
    brand: { type: mongoose.Types.ObjectId, ref: 'Brand', required: true }
  },
  { timestamps: true }
);
productSchema.plugin(mongoosePaginate);
productSchema.plugin(AutoIncrement, { inc_field: 'productId' });

module.exports = mongoose.model('Product', productSchema);