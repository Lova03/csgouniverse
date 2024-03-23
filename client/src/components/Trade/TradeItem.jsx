import { useState } from 'react';
import { FaGem } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectShowDetailHover, selectShowDetailClick } from '../../features/trades/tradesSlice';
import TradeItemTooltip from './TradeItemTooltip';

const getGemColor = (phase) => {
  if (phase === 'emerald') return 'text-[#2EDB4D]';
  if (phase === 'ruby') return 'text-[#CD2A40]';
  if (phase === 'sapphire') return 'text-[#5929C1]';
  // if (gem === 'blue-gem' || gem === 'blue gem') return 'text-[#31DFFE]';
  return 'text-white';
};

const TradeItem = ({ highlight = false, item, big = false, offering }) => {
  const showDetailHover = useSelector(selectShowDetailHover);
  const showDetailClick = useSelector(selectShowDetailClick);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [pinned, setPinned] = useState(false);

  const flex = big ? 'flex-[.5]' : 'flex-[.25]';

  if (item === null)
    return (
      <div className={`${flex} relative`}>
        <div className='flex pb-[100%] overflow-hidden rounded-md shadow-none bg-transparent'></div>
      </div>
    );

  const handleLeave = () => setHovered(false);
  const handleEnter = () => setHovered(true);
  const handleClick = () => {
    if (showDetailClick && hovered) setHovered(false);
    if (!showDetailClick) return;
    setClicked((prev) => !prev);
  };

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={`${flex} relative`}>
      <div
        onClick={handleClick}
        className={`flex pb-[100%] overflow-hidden rounded-md shadow-xl bg-trade-item transition-all duration-300${
          showDetailClick && ' cursor-pointer'
        } outline-2 outline outline-zinc-900 hover:bg-trade-item-lighter`}>
        <img
          className='absolute w-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          src={item.pic}
          alt=''
        />
        {item.phase && (
          <div
            className={`${getGemColor(
              item.phase
            )} absolute flex justify-center items-center top-0 right-0 sm:top-1 sm:right-1 rounded-full ${
              big ? ' w-9 h-9' : 'w-7 h-7'
            } sm:w-9 sm:h-9`}>
            <FaGem size={big ? '1.5rem' : '1rem'} />
          </div>
        )}
        <div
          className={`absolute w-full bottom-0 ${
            big ? 'py-2' : 'py-1'
          } px-1 text-xs md:text-sm text-center${highlight ? ' font-semibold' : ''}${
            item.wear !== 'no float'
              ? ' bg-black/10'
              : big && item.wear === 'no float'
              ? ' sm:bg-black/10'
              : ''
          }`}>
          {big && item.isStatTrak && (
            <span className='font-semibold text-[#CF6A32] text-sm'>StatTrak™</span>
          )}
          {big && item.isSouvenir && (
            <span className='font-semibold text-[#FFD700] text-sm'>Souvenir</span>
          )}
          {big && (
            <span className='hidden sm:block'>
              {item.pureName} {item.wear !== 'no float' && <span>{item.wear}</span>}
            </span>
          )}
          {big && item.longerWear !== 'no float' && (
            <span className='block sm:hidden'>{item.longerWear}</span>
          )}
          {!big && item.wear !== 'no float' && <span>{item.wear}</span>}
        </div>
        {!big && (item.isStatTrak || item.isSouvenir) && (
          <div className='absolute top-0 left-0 flex w-full justify-center items-center mt-1 py-1'>
            {item.isStatTrak && (
              <span className='font-semibold text-[#CF6A32] text-xs hidden xs:block'>StatTrak™</span>
            )}
            {item.isStatTrak && (
              <div className='bg-[#CF6A32] shadow-slight-shine w-[10px] h-[10px] mr-2 ml-auto rounded-full block xs:hidden'></div>
            )}
            {item.isSouvenir && <span className='font-semibold text-[#FFD700] text-xs'>Souvenir</span>}
          </div>
        )}
      </div>
      {(((hovered || pinned) && showDetailHover) || (clicked && showDetailClick)) && (
        <TradeItemTooltip
          item={item}
          handleClick={handleClick}
          pinned={pinned}
          setPinned={setPinned}
          offering={offering}
        />
      )}
    </div>
  );
};

export default TradeItem;
