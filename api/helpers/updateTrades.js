const getPrice = require('../helpers/getPrice');

const updatePrice = async (skin) => {
  const { price, priceValue, priceRecord } = await getPrice(skin.market_hash_name);

  const newSkin = { ...skin };

  newSkin.price = price;
  newSkin.priceValue = priceValue;
  newSkin.priceRecord = priceRecord;

  return newSkin;
};

module.exports = (trades) => {
  const tradesDoc = [...trades];

  const promises = tradesDoc.map(async (trade) => {
    const tradeDoc = { ...trade._doc };
    const offersOther = await Promise.all(
      tradeDoc.offers.other.map(async (skin) => {
        const skinDoc = { ...skin._doc };
        const updated = await updatePrice(skinDoc);
        return updated;
      })
    );

    const wantsOther = await Promise.all(
      tradeDoc.wants.other.map(async (skin) => {
        const skinDoc = { ...skin._doc };
        const updated = await updatePrice(skinDoc);
        return updated;
      })
    );

    const offersHighlight = await updatePrice(tradeDoc.offers.highlight);
    const wantsHighlight = await updatePrice(tradeDoc.wants.highlight);

    return {
      offers: {
        highlight: offersHighlight,
        other: offersOther,
      },
      wants: {
        highlight: wantsHighlight,
        other: wantsOther,
      },
      author: tradeDoc.author,
      totalOffers: tradeDoc.totalOffers,
      totalWants: tradeDoc.totalWants,
      info: tradeDoc.info,
      comments: tradeDoc.comments,
      id: tradeDoc.id,
    };
  });

  return Promise.all(promises);
};
