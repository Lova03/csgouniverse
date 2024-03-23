const Skin = require('./models/Skin');
const { default: axios } = require('axios');
const getName = require('./helpers/getName');

let updateInterval;

const createSkinRecord = async (skin, currency) => {
  console.log(`Creating a record for item: ${skin.name}`);

  const { isStatTrak, isSouvenir, name: pureName } = getName(skin.name);

  if (!skin.exterior) {
    skin.exterior =
      skin.name.includes('(') && skin.name.includes(')')
        ? skin.name.slice(skin.name.indexOf('(') + 1, skin.name.indexOf(')'))
        : 'no float';
  }

  const wear =
    skin.exterior === 'Factory New'
      ? 'FN'
      : skin.exterior === 'Minimal Wear'
      ? 'MW'
      : skin.exterior === 'Field-Tested'
      ? 'FT'
      : skin.exterior === 'Well-Worn'
      ? 'WW'
      : skin.exterior === 'Battle-Scarred'
      ? 'BS'
      : 'no float';

  const price = !skin.price
    ? 'no price'
    : skin.price['24_hours']?.average
    ? skin.price['24_hours']?.average
    : skin.price['7_days']?.average
    ? skin.price['7_days']?.average
    : skin.price['30_days']?.average
    ? skin.price['30_days']?.average
    : skin.price['all_time']?.average
    ? skin.price['all_time']?.average
    : 'unknown';

  const newSkin = new Skin({
    market_hash_name: skin.name,
    pureName,
    longerWear: skin.exterior,
    wear,
    pic: `https://steamcommunity-a.akamaihd.net/economy/image/${skin.icon_url}`,
    picLarge: `https://steamcommunity-a.akamaihd.net/economy/image/${skin.icon_url_large}`,
    color: skin.rarity_color,
    type: skin.type,
    weapon_type: skin.weapon_type,
    gun_type: skin.gun_type,
    exterior: skin.exterior,
    rarity: skin.rarity,
    price: `${price}${currency == 'USD' ? '$' : currency == 'EUR' ? '€' : currency}`,
    priceRecord: skin.price,
    priceValue: skin.price ? (price === 'unknown' ? 0 : price) : 0,
    isSouvenir,
    isStatTrak,
    classid: skin.classid,
    marketable: skin.marketable,
    tradable: skin.tradable,
  });

  await newSkin.save();

  console.log(`Successfully created a record for item: ${skin.name}`);

  return true;
};

const updatePrice = async (skin, currency) => {
  console.log(`Updating price for item: ${skin.name}`);
  const price = !skin.price
    ? 'no price'
    : skin.price['24_hours']?.average
    ? skin.price['24_hours']?.average
    : skin.price['7_days']?.average
    ? skin.price['7_days']?.average
    : skin.price['30_days']?.average
    ? skin.price['30_days']?.average
    : skin.price['all_time']?.average
    ? skin.price['all_time']?.average
    : 'unknown';

  await Skin.findOneAndUpdate(
    { market_hash_name: skin.name },
    {
      $set: {
        price: `${price}${currency == 'USD' ? '$' : currency == 'EUR' ? '€' : currency}`,
        priceRecord: skin.price,
        priceValue: skin.price ? (price === 'unknown' ? 0 : price) : 0,
      },
    }
  );
  console.log(`Finished updating price for item: ${skin.name}`);
  return true;
};

const updateOne = async (skin, currency) => {
  skin.name = skin.name.replace(/&39/g, "'");
  skin.name = skin.name.replace(/&#39/g, "'");
  const existing = await Skin.findOne({ market_hash_name: skin.name });
  if (!existing) return createSkinRecord(skin, currency);
  if (existing) return updatePrice(skin, currency);
};

const updateSkins = async (skins) => {
  console.log('\nStarting updating proccess.\n');
  const { items_list, currency } = skins;
  for (let skin in items_list) {
    const success = await updateOne(items_list[skin], currency);
    if (!success) console.log(`Failed to update ${skin}`);
    if (success) console.log(`Successfully updated ${skin}`);
  }
  console.log('\nFinished updating proccess.\n\nWaiting 7 hours for the next update...\n');
};

const update = async () => {
  console.log('\nFetching skin data...\n');
  try {
    const response = await axios.get('http://csgobackpack.net/api/GetItemsList/v2/');

    if (!response || response?.status != 200 || !response?.data?.success)
      throw new Error('Request failed!');

    return updateSkins(response.data);
  } catch (err) {
    console.log(err);
    return false;
  }
};

const start = async () => {
  console.log('\nStarting price checking...\n');
  await update();
  updateInterval = setInterval(async () => {
    await update();
  }, 7 * 60 * 60 * 1000);
};

const end = () => clearInterval(updateInterval);

module.exports = start;
