const Skin = require('../models/Skin');

module.exports = async (market_hash_name) => {
  const existingSkin = await Skin.findOne({ market_hash_name: market_hash_name });
  if (!existingSkin)
    return {
      price: '-$',
      priceValue: 0,
      priceRecord: false,
    };

  const { price, priceValue, priceRecord } = existingSkin;

  return { price: price, priceValue, priceRecord };
};
