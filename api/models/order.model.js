const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const orderSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
orderSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Order', orderSchema);