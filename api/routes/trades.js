const verify = require('../helpers/verify');
const Trade = require('../models/Trade');
const { v4 } = require('uuid');
const User = require('../models/User');
const updateTrades = require('../helpers/updateTrades');
const addAuthor = require('../helpers/addAuthor');
const Filter = require('bad-words');
const filter = new Filter();

const tradesRouter = require('express').Router();

tradesRouter.param('tradeId', async (req, res, next, id) => {
  const existingTrade = await Trade.findOne({ id: id });
  if (existingTrade) {
    const updated = await updateTrades([existingTrade]);
    const authorAdded = await Promise.all(updated.map(async (trade) => addAuthor(trade)));
    req.foundTrade = authorAdded[0];
    next();
  } else {
    res.status(404).json({ success: false, msg: 'Trade not found!' });
  }
});

tradesRouter.get('/:tradeId', async (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Successfully found the trade', data: req.foundTrade });
});

tradesRouter.get('/', async (req, res, next) => {
  let { l: page, q: prompt } = req.query;
  page = Number(page);
  if (!page) page = 1;
  if (!prompt) prompt = '';
  if (page < 0) return res.status(400).json({ success: false, msg: 'Page cannot be in negative' });
  const prompts = prompt.split(' ');
  const trades = await Trade.find({
    $or: [
      // TODO: TEST THIS
      {
        $and: prompts.map((q) => {
          return { 'offers.highlight.market_hash_name': { $regex: new RegExp(`.*${q}.*`, 'i') } };
        }),
      },
      {
        $and: prompts.map((q) => {
          return { 'wants.highlight.market_hash_name': { $regex: new RegExp(`.*${q}.*`, 'i') } };
        }),
      },
      {
        $and: prompts.map((q) => {
          return {
            'offers.other': {
              $elemMatch: { market_hash_name: { $regex: new RegExp(`.*${q}.*`, 'i') } },
            },
          };
        }),
      },
      {
        $and: prompts.map((q) => {
          return {
            'wants.other': {
              $elemMatch: { market_hash_name: { $regex: new RegExp(`.*${q}.*`, 'i') } },
            },
          };
        }),
      },
    ],
  })
    // const trades = await Trade.find()
    .skip((page - 1) * 10)
    .limit(10)
    .catch(() => {
      return res.status(400).json({ success: false, msg: 'Failed to fetch items from database' });
    });

  const updated = await updateTrades([...trades]);

  const authorAdded = await Promise.all(updated.map(async (trade) => addAuthor(trade)));

  return res.status(200).json({ success: true, data: authorAdded });
});

tradesRouter.post('/', verify, async (req, res, next) => {
  const { body } = req;
  const { offers, wants, info } = body;
  const { id } = req.user;

  if (!offers || !wants)
    return res
      .status(400)
      .json({ success: false, msg: 'You need to define offers and wants properties' });

  const user = await User.findOne({ id: id });

  if ((user.trades.length >= 10 && !user.isPremium) || (user.trades.length >= 15 && user.isPremium))
    return res
      .status(403)
      .json({ success: false, msg: "You've reached your maximum amount of posted trades" });

  if (wants.length === 0 || offers.length === 0)
    return res.status(400).json({ success: false, msg: 'Select at least one item in both sections' });

  const sortedWants = wants.sort(({ priceValue: a = 0 }, { priceValue: b = 0 }) => (a < b) - (b < a));
  const sortedOffers = offers.sort(({ priceValue: a = 0 }, { priceValue: b = 0 }) => (a < b) - (b < a));
  const highlightWants = sortedWants.shift();
  const highlightOffers = sortedOffers.shift();

  let totalOffers = highlightOffers.priceValue || 0;
  sortedOffers.forEach((skin) => (totalOffers += skin.priceValue || 0));

  let totalWants = highlightWants.priceValue || 0;
  sortedWants.forEach((skin) => (totalWants += skin.priceValue || 0));

  const tradeid = v4();

  const trade = new Trade({
    id: tradeid,
    author: id,
    totalOffers: totalOffers,
    totalWants: totalWants,
    info: info.length > 0 ? filter.clean(info) : '',
    offers: { highlight: highlightOffers, other: sortedOffers },
    wants: { highlight: highlightWants, other: sortedWants },
  });

  await trade.save();

  await User.findOneAndUpdate({ id: id }, { $push: { trades: tradeid } });

  return res.status(201).json({ success: true, msg: 'Successfully created trade', data: trade });
});

module.exports = tradesRouter;

/*

const {
      price: OHPrice,
      priceValue: OHPriceValue,
      priceRecord: OHPriceRecord,
    } = await getPrice(trade.offers.highlight.market_hash_name);
    newTrade.offers.highlight = {
      price: OHPrice,
      priceValue: OHPriceValue,
      priceRecord: OHPriceRecord,
      ...trade.offers.highlight,
    };

    const {
      price: WHPrice,
      priceValue: WHPriceValue,
      priceRecord: WHPriceRecord,
    } = await getPrice(trade.wants.highlight.market_hash_name);
    newTrade.wants.highlight = {
      price: WHPrice,
      priceValue: WHPriceValue,
      priceRecord: WHPriceRecord,
      ...trade.wants.highlight,
    };

    newTrade.offers.other = await newTrade.offers.other.map(async (skin) => {
      const {
        price: OOPrice,
        priceValue: OOPriceValue,
        priceRecord: OOPriceRecord,
      } = await getPrice(skin.market_hash_name);
      return {
        price: OOPrice,
        priceValue: OOPriceValue,
        priceRecord: OOPriceRecord,
        ...skin,
      };
    });

    newTrade.wants.other = await newTrade.wants.other.map(async (skin) => {
      const {
        price: WOPrice,
        priceValue: WOPriceValue,
        priceRecord: WOPriceRecord,
      } = await getPrice(skin.market_hash_name);
      return {
        price: WOPrice,
        priceValue: WOPriceValue,
        priceRecord: WOPriceRecord,
        ...skin,
      };
    });

*/
