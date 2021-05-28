const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const countrySchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, required: true },
  nativeName: { type: String, required: true },
  alpha2Code: { type: String, required: true },
  alpha3Code: { type: String, required: true },
  callingCodes: { type: String },
  region: { type: String },
  subregion: { type: String },
  imageBase64: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
countrySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Country', countrySchema);