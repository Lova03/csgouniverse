const axios = require('axios');
const Skin = require('../models/Skin');

const getName = require('./getName');

module.exports = async (item, price) => {
  try {
    const { isStatTrak, isSouvenir, name: pureName } = getName(item.market_hash_name);
    const longerWear =
      item.market_hash_name.includes('(') && item.market_hash_name.includes(')')
        ? item.market_hash_name.slice(
            item.market_hash_name.indexOf('(') + 1,
            item.market_hash_name.indexOf(')')
          )
        : 'no float';
    const wear =
      longerWear === 'Factory New'
        ? 'FN'
        : longerWear === 'Minimal Wear'
        ? 'MW'
        : longerWear === 'Field-Tested'
        ? 'FT'
        : longerWear === 'Well-Worn'
        ? 'WW'
        : longerWear === 'Battle-Scarred'
        ? 'BS'
        : 'no float';

    const newSkin = new Skin({
      market_hash_name: item.market_hash_name,
      pureName,
      longerWear,
      wear,
      pic: item.pic,
      color: item.color,
      price,
      isSouvenir,
      isStatTrak,
      nameID: item.nameID || 'unknown',
    });

    await newSkin.save();
    return true;
  } catch (err) {
    console.log(err);
    console.log('Failed to register skin!');
  }
  return false;
};
