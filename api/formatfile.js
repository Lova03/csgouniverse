const fs = require('fs');
const source = require('./response2.json');
const { items } = require('./items.json');

const { data } = source;

fs.writeFile('./data.json', '', (err) => {
  if (err) return console.log(err);
  console.log('File created!');
});

const writer = fs.createWriteStream('./data.json');

const notfound = [];
const res = [];
items.forEach((name) => {
  const idx = data.findIndex((x) => x.market_hash_name === name);
  if (idx < 0) return notfound.push({ name });
  const { border_color, image, nameID } = data[idx];
  return res.push({
    name,
    color: border_color,
    pic: image,
    nameID,
  });
});

const combined = res.concat(notfound);

const response = { items: combined };
const jsonResponse = JSON.stringify(response);
writer.write(jsonResponse);
writer.end();
