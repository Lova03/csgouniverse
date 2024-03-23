const Skin = require('../models/Skin');
const getPrice = require('./getPrice');
const registerSkin = require('./registerSkin');

module.exports = async (item) => {
  const existingSkin = await Skin.findOne({ market_hash_name: item.market_hash_name });
  const price = await getPrice(item.market_hash_name);
  if (existingSkin) {
    await Skin.findOneAndUpdate(
      { market_hash_name: item.market_hash_name },
      { $set: { price: price }, $push: { history: existingSkin.price } }
    );
    return;
  }
  return registerSkin(item, price);
};
