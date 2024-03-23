import { PhotoIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import TradeItemTooltip from '../Trade/TradeItemTooltip';

const CreateTradeFormItem = ({ item, selecting, owned, wanted, selected, setSelected, handleClick }) => {
  const isSelected =
    !owned && !wanted
      ? false
      : owned
      ? selected.findIndex((x) => x.assetid === item.assetid) !== -1
      : selected.findIndex((x) => x._id === item._id) !== -1;
  const [hovered, setHovered] = useState(false);
  const handleLeave = () => setHovered(false);
  const handleEnter = () => setHovered(true);
  const deselect = (item) => {
    if (item._id) setSelected((prev) => prev.filter((x) => x._id !== item._id));
    if (item.assetid) setSelected((prev) => prev.filter((x) => x.assetid !== item.assetid));
  };

  if (selecting)
    return (
      <div onClick={handleClick} className='w-full relative'>
        <div className='flex pb-[100%] rounded-md bg-trade-item-darker relative cursor-pointer transition-all duration-300 hover:bg-trade-item group'>
          <div className='absolute flex items-center justify-center w-full h-full p-2'>
            <PlusCircleIcon className='h-12 presm:h-20 text-trade-item transition-all duration-300 group-hover:text-trade-item-lighter' />
          </div>
        </div>
      </div>
    );

  if (!item)
    return (
      <div className='w-full relative'>
        <div className='flex pb-[100%] rounded-md bg-trade-item-darker relative cursor-pointer transition-all duration-300 hover:bg-trade-item group'>
          <div className='absolute flex items-center justify-center w-full h-full p-2'>
            <span className='text-trade-item transition-all duration-300 group-hover:text-trade-item-lighter'>
              no item
            </span>
          </div>
        </div>
      </div>
    );

  const color = '#' + (item.color || 'FFF');

  if (owned)
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
        {hovered && <TradeItemTooltip item={item} formItem />}
      </div>
    );

  if (wanted)
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
        {hovered && <TradeItemTooltip item={item} formItem isWanted deselect={deselect} />}
      </div>
    );

  return (
    <div className='w-full relative'>
      <div className='flex pb-[100%] rounded-md bg-trade-item relative shadow-lg transition-all duration-300 hover:bg-trade-item-lighter'>
        <div className='absolute flex rounded-md overflow-hidden items-center justify-center w-full h-full p-2'>
          <div className={`w-full h-[6px] absolute top-0 left-0 bg-[${color}]`}></div>
          <img className='absolute px-2' src={item.pic} alt='' />
          <p className='absolute bottom-2 text-sm'>{item.longerWear}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateTradeFormItem;
