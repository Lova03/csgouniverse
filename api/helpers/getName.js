module.exports = (value) => {
  const isStatTrak = value.includes('StatTrak™');
  const isSouvenir = value.includes('Souvenir');

  let name = value;
  if (isStatTrak) name = name.replace('StatTrak™ ', '');
  if (isSouvenir) name = name.replace('Souvenir ', '');
  if (name.includes('(') && name.includes(')') && !name.includes('Sticker |')) {
    const x = name.slice(name.indexOf('('), name.indexOf(')') + 1);
    name = name.replace(x, '');
  }
  if (name.includes('Sticker |')) {
    name = name.replace('Sticker | ', '');
  }
  name = name.replace(/  +/g, ' ');
  name = name.replace('&#39', "'");

  name = name.split('');
  if (name[name.length - 1] == ' ') name.pop();
  if (name[0] == ' ') name.shift();
  name = name.join('');

  return {
    isSouvenir,
    isStatTrak,
    name,
    tags: {
      stattrak: 'StatTrak™',
      souvenir: 'Souvenir',
    },
  };
};
