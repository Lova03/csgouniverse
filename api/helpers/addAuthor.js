const User = require('../models/User');

module.exports = async (trade) => {
  const author = await User.findOne({ id: trade.author });
  const { notifications, donated, trades, _id, __v, createdAt, updatedAt, ...rest } = author._doc;

  return {
    ...trade,
    author: rest,
  };
};
