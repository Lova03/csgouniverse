import { PhotoIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import TradeItemTooltip from '../../components/Trade/TradeItemTooltip';

const TradeDetailItem = ({ isWanted, item }) => {
  const [hovered, setHovered] = useState(false);
  const handleLeave = () => setHovered(false);
  const handleEnter = () => setHovered(true);

  const color = '#' + (item.color || 'FFF');
  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave} className='w-full relative'>
      <div className='flex pb-[100%] rounded-md bg-trade-item relative shadow-lg transition-all duration-300 hover:bg-trade-item-lighter'>
        <div className='absolute flex rounded-md overflow-hidden items-center justify-center w-full h-full p-2'>
          <div
            style={{ backgroundColor: color }}
            className={`w-full h-[6px] absolute top-0 left-0`}></div>
          {item.isStatTrak && item.color !== 'CF6A32' && (
            <div className={`w-1/2 h-[6px] absolute top-0 left-0 bg-[#CF6A32]`}></div>
          )}
          {item.isSouvenir && item.color !== 'FFD700' && (
            <div className={`w-1/2 h-[6px] absolute top-0 left-0 bg-[#FFD700]`}></div>
          )}
          {(item.pic || item.picLarge) && (
            <img className='absolute px-2' src={item.pic || item.picLarge} alt='' />
          )}
          {!item.pic && !item.picLarge && <PhotoIcon className='absolute px-2 h-14' />}
          {item.wear !== 'no float' && (
            <p className='absolute bottom-2 text-center block text-xs xl:hidden'>{item.wear}</p>
          )}
          {item.longerWear !== 'no float' && (
            <p className='absolute bottom-2 text-center hidden text-xs xl:block'>{item.longerWear}</p>
          )}
        </div>
      </div>
      {hovered && <TradeItemTooltip item={item} formItem detailed isWanted={isWanted} />}
    </div>
  );
};

export default TradeDetailItem;
