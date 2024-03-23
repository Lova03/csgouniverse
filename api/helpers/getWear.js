module.exports = (value) => {
  if (!value.includes('Exterior')) return false;
  const longerWear = value.replace('Exterior: ', '');
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
      : '';

  return { longerWear, wear };
};
