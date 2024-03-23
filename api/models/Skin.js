const mongoose = require('mongoose');
const { Schema } = mongoose;

const skinSchema = new Schema(
  {
    market_hash_name: { type: String, required: true },
    longerWear: { type: String, default: 'no float' },
    wear: { type: String, default: 'no float' },
    pureName: { type: String, required: true },
    pic: { type: String, default: 'no-image' },
    picLarge: { type: String, default: 'no-image' },
    color: { type: String, default: '#ffffff' },
    type: { type: String, default: '' },
    weapon_type: { type: String, default: '' },
    gun_type: { type: String, default: '' },
    exterior: { type: String, default: '' },
    rarity: { type: String, default: '' },
    price: { type: String, required: true },
    priceRecord: { type: Object, default: {} },
    priceValue: { type: Number, required: true },
    isStatTrak: { type: Boolean, required: true },
    isSouvenir: { type: Boolean, required: true },
    classid: { type: String, default: 'unknown classid' },
    marketable: { type: Boolean, default: false },
    tradable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

skinSchema.index({ market_hash_name: 'text' });

module.exports = mongoose.model('Skin', skinSchema);
