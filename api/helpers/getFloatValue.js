const { default: axios } = require('axios');

const url = 'https://api.csgofloat.com';

module.exports = async (inspect_link) => {
  const params = `?url=${inspect_link}`;

  return axios
    .get(url + params)
    .then((res) => {
      if (res.status === 200) return res.data.iteminfo;
      throw new Error('Request failed!');
    })
    .catch((err) => {
      console.log(err.message || err);
      return null;
    });
};
