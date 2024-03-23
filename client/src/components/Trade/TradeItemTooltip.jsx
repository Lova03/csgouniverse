import { XMarkIcon } from '@heroicons/react/24/outline';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { selectShowDetailClick, selectShowDetailHover } from '../../features/trades/tradesSlice';
import FloatValueBar from './FloatValueBar';
import Tags from './Tags';
import TradeItemImage from './TradeItemImage';

const TradeItemTooltip = ({
  item,
  handleClick,
  pinned,
  setPinned,
  formItem,
  isWanted,
  offering,
  deselect,
  detailed,
}) => {
  const showDetailClick = useSelector(selectShowDetailClick);
  const showDetailHover = useSelector(selectShowDetailHover);

  const handlePinClick = () => {
    setPinned((prev) => !prev);
  };

  const handleRemove = () => {
    deselect(item);
  };

  if (formItem)
    return (
      <div
        className={`hidden md:flex flex-col absolute -top-24 left-1/2 -translate-x-1/2 bg-trade-item-darker select-text shadow-xl rounded-lg p-3 w-72 max-h-[26rem] min-h-[24rem] z-10 overflow-hidden`}>
        <div
          style={{ backgroundColor: '#' + (item.color || 'FFFFFF') }}
          className='absolute top-0 w-full h-2 left-0'></div>
        {item.isStatTrak && item.color !== 'CF6A32' && (
          <div className={`w-1/2 h-2 absolute top-0 left-0 bg-[#CF6A32]`}></div>
        )}
        {item.isSouvenir && item.color !== 'FFD700' && (
          <div className={`w-1/2 h-2 absolute top-0 left-0 bg-[#FFD700]`}></div>
        )}
        <p className='text-sm text-center px-3'>
          {item.wear === 'no float' && !item.market_hash_name.includes('Music Kit')
            ? item.market_hash_name || 'not registered'
            : item.pureName || 'not registered'}
        </p>
        <div className='flex items-center justify-evenly'>
          {item.isStatTrak && <p className='text-xs text-center mt-1'>StatTrak™</p>}
          {item.isSouvenir && <p className='text-xs text-center mt-1'>Souvenir</p>}
          {item.longerWear !== 'no float' && (
            <p className='text-xs text-center mt-1'>{item.longerWear}</p>
          )}
        </div>
        <TradeItemImage pic={item.pic ? item.pic : item.picLarge} />
        <div className='flex flex-col flex-1 items-center'>
          <div className='font-rubik w-5/6 flex mt-2'>
            <div className='rounded-md bg-trade-item-lighter px-4 py-1'>
              <span>{item.price === 'unknown price' || !item.price ? 'unknown' : item.price || ''}</span>
            </div>
          </div>
          {!isWanted && (
            <div className='flex flex-col flex-1 w-full items-center pt-2'>
              {item.floatvalue !== undefined && (
                <FloatValueBar float={item.floatvalue} min={item.minFloat} max={item.maxFloat} />
              )}
              {item.inspect && (
                <a
                  rel='noreferrer'
                  href={item.inspect}
                  className='cursor-pointer mt-auto mb-1 text-sm text-slate-400 underline-offset-4 underline'>
                  Inspect in game
                </a>
              )}
            </div>
          )}
          {isWanted && !detailed && (
            <div className='mt-auto w-full py-2 flex justify-center items-center select-none'>
              <button
                onClick={handleRemove}
                className='uppercase rounded-md px-3 py-1 bg-rose-800 shadow-md'>
                Remove
              </button>
            </div>
          )}
          <Tags item={item} />
        </div>
      </div>
    );

  return (
    <div
      className={`hidden md:flex flex-col absolute isolate bottom-28 left-1/2 -translate-x-1/2 bg-trade-item-darker select-text shadow-xl rounded-lg p-3 w-72 max-h-[26rem] min-h-[24rem] z-10 overflow-hidden`}>
      {showDetailClick && (
        <div
          onClick={handleClick}
          className='absolute rounded-md top-12 right-1 transition-all duration-150 cursor-pointer z-10 border-2 border-solid border-trade-item-lighter hover:text-rose-800'>
          <XMarkIcon className='h-5' />
        </div>
      )}
      <div
        style={{ backgroundColor: '#' + item.color || 'FFFFFF' }}
        className='absolute top-0 w-full h-2 left-0'></div>
      {item.isStatTrak && item.color !== 'CF6A32' && (
        <div className={`w-1/2 h-2 absolute top-0 left-0 bg-[#CF6A32]`}></div>
      )}
      {item.isSouvenir && item.color !== 'FFD700' && (
        <div className={`w-1/2 h-2 absolute top-0 left-0 bg-[#FFD700]`}></div>
      )}
      <p className='text-sm text-center px-3'>
        {item.wear === 'no float' && !item.market_hash_name.includes('Music Kit')
          ? item.market_hash_name || 'not registered'
          : item.pureName || 'not registered'}
      </p>
      <div className='flex items-center justify-evenly'>
        {item.isStatTrak && <p className='text-xs text-center mt-1'>StatTrak™</p>}
        {item.isSouvenir && <p className='text-xs text-center mt-1'>Souvenir</p>}
        {item.longerWear !== 'no float' && <p className='text-xs text-center mt-1'>{item.longerWear}</p>}
      </div>
      <TradeItemImage pic={item.pic ? item.pic : item.picLarge} />
      <div className='flex flex-col flex-1 items-center'>
        <div className='font-rubik w-5/6 flex mt-2'>
          <div className='rounded-md bg-trade-item-lighter px-4 py-1'>
            <span>{item.price === 'unknown price' || !item.price ? 'unknown' : item.price || ''}</span>
          </div>
        </div>
        {offering && (
          <div className='flex flex-col flex-1 w-full items-center pt-2'>
            {item.floatvalue !== undefined && (
              <FloatValueBar float={item.floatvalue} min={item.minFloat} max={item.maxFloat} />
            )}
            {item.inspect && (
              <a
                rel='noreferrer'
                href={item.inspect}
                className='cursor-pointer mt-auto mb-1 text-sm text-slate-400 underline-offset-4 underline'>
                Inspect in game
              </a>
            )}
          </div>
        )}
        <Tags item={item} />
      </div>
    </div>
  );
};

export default TradeItemTooltip;
