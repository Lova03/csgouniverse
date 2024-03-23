const verify = require('../helpers/verify');
const axios = require('axios');
const getWear = require('../helpers/getWear');
const getName = require('../helpers/getName');
const getPhase = require('../helpers/getPhase');

const Skin = require('../models/Skin');
const tradesRouter = require('./trades');
const getFloatValue = require('../helpers/getFloatValue');
const commentsRouter = require('./comments');

const apiRouter = require('express').Router();

let calls = 0;
let cooldown;

apiRouter.get('/user', verify, (req, res) => {
  res.status(200).json(req.user);
});

apiRouter.get('/user/inventory', verify, async (req, res) => {
  // FIXME
  // 20x za minutu max
  // calls++;
  // if (calls === 21) {
  //   cooldown = setTimeout(() => {
  //     calls = 0;
  //   }, 60 * 1000);
  // }
  // if (calls > 20) {
  //   return res.status(429).json({ success: false, msg: 'Too Many Requests' });
  // }

  const response = await axios
    .get(`https://steamcommunity.com/inventory/${req.user?.steamid}/730/2?l=english`) //&count=5000
    .catch((err) => {
      console.log(err);
      return err.response;
    });

  if (response?.status !== 200 || !response) {
    return res.status(response.status).json({ success: false, msg: response.statusText });
  }

  const { assets, descriptions, total_inventory_count: totalCount } = response.data;

  const items = [];
  for (let asset of assets) {
    const item = { ...asset };
    for (let desc of descriptions) {
      if (item.classid === desc.classid) {
        item.pic = `https://steamcommunity-a.akamaihd.net/economy/image/${desc.icon_url}`;
        item.picLarge = `https://steamcommunity-a.akamaihd.net/economy/image/${desc.icon_url_large}`;
        desc.actions &&
          (item.inspect = desc.actions[0]?.link
            .replace('%owner_steamid%', req.user?.steamid)
            .replace('%assetid%', item.assetid));
        item.tradable = desc.tradable === 1;
        const hasWear = getWear(desc.descriptions[0].value);
        item.longerWear = !hasWear ? 'no float' : hasWear.longerWear;
        item.wear = !hasWear ? 'no float' : hasWear.wear;

        if (item.inspect && item.tradable && hasWear) {
          const iteminfo = await getFloatValue(item.inspect);
          if (iteminfo) {
            item.floatvalue = iteminfo.floatvalue;
            item.origin = iteminfo.origin_name;
            item.minFloat = iteminfo.min;
            item.maxFloat = iteminfo.max;
            iteminfo.imageurl && (item.pic = iteminfo.imageurl);
            item.paintseed = iteminfo.paintseed;
            item.defindex = iteminfo.defindex;
            item.paintindex = iteminfo.paintindex;
            item.stickers = iteminfo.stickers;
          }
        }
        const { name, isSouvenir, isStatTrak, tags } = getName(desc.name);
        item.isSouvenir = isSouvenir;
        item.isStatTrak = isStatTrak;
        item.tags = tags;
        item.pureName = name;
        item.market_hash_name = desc.market_hash_name;
        const { hasPhase, phase } = getPhase(desc.market_hash_name, desc.icon_url, desc.icon_url_large);
        if (hasPhase) item.phase = phase;
        const existingSkin = await Skin.findOne({ market_hash_name: desc.market_hash_name });
        if (existingSkin) {
          item.price = existingSkin.price;
          item.priceValue = existingSkin.priceValue;
          item.priceRecord = existingSkin.priceRecord;
          item.type = existingSkin.type;
          item.gun_type = existingSkin.gun_type;
          item.weapon_type = existingSkin.weapon_type;
          item.exterior = existingSkin.exterior;
          item.rarity = existingSkin.rarity;
          item.marketable = existingSkin.marketable;
          item.color = existingSkin.color;
        }
      }
    }
    items.push(item);
  }

  items.sort((a, b) => Number(b.tradable) - Number(a.tradable));

  res.status(200).send({ totalCount, items });
});

// TODO:
/*
 *
 * Better searching filter
 * Maybe split the prompt and use some sort of "OR" in mongo
 *
 */
apiRouter.get('/items', async (req, res, next) => {
  let { l: page, q: prompt } = req.query;
  page = Number(page);
  if (!page) page = 1;
  if (!prompt) prompt = '';
  if (page < 0) return res.status(400).json({ success: false, msg: 'Page cannot be in negative' });
  const prompts = prompt.split(' ');
  const skins = await Skin.find({
    $and: prompts.map((q) => {
      return { market_hash_name: { $regex: new RegExp(`.*${q}.*`, 'i') } };
    }),
  })
    .skip((page - 1) * 50)
    .limit(50)
    .catch(() => {
      return res.status(400).json({ success: false, msg: 'Failed to fetch items from database' });
    });

  return res.status(200).json({ success: true, data: skins });
  /*
    if (l) {
    const listNum = Math.floor(Number(l));
    if (listNum < 1 || Number.isNaN(listNum))
      return res.status(400).json({ success: false, msg: 'Invalid list number' });

    const skins = await Skin.find()
      .skip((listNum - 1) * 20)
      .limit(20);

    return res.status(200).json(skins);
  }
  if (q) {
    if (q.length < 5)
      return res.status(400).json({ success: false, msg: 'You need to provide longer seach term' });
  }
  */
});

apiRouter.use('/trades', tradesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
