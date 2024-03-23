const { items } = require('../data.json');
const updateSkin = require('./updateSkin');

module.exports = async () => {
  let index = 0;
  const total = items.length;
  const cycleSkins = async () => {
    for (let i = 0; i < 20; i++) {
      await updateSkin(items[index]);
      index++;
      if (index === total - 1) {
        index = 0;
      }
    }
  };

  await cycleSkins();

  setInterval(async () => {
    await cycleSkins();
  }, 6 * 60 * 1000);
};
