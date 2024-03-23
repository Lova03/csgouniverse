import color from 'color';

const Tags = ({ item }) => {
  const getTextColor = () => {
    const luminosity = color('#' + item.color).luminosity();
    return luminosity > 0.5 ? 'black' : 'white';
  };

  return (
    <div className='flex text-xs justify-center items-center mt-auto flex-wrap'>
      {item.weapon_type && <span className='formitemtag bg-slate-500'>{item.weapon_type}</span>}
      {item.type && <span className='formitemtag bg-slate-500'>{item.type}</span>}
      {item.rarity && (
        <span
          className='formitemtag'
          style={{ backgroundColor: '#' + item.color, color: getTextColor() }}>
          {item.rarity}
        </span>
      )}
      {item.isStatTrak && <span className='formitemtag bg-[#CF6A32]'>StatTrak™</span>}
      {item.isSouvenir && <span className='formitemtag bg-[#FFD700] text-black'>Souvenir</span>}
    </div>
  );
};

export default Tags;
