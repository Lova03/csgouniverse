import { CheckCircleIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const WantsItem = ({ item, selectedWants, setSelectedWants }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const isSelected = selectedWants.findIndex((x) => x._id === item._id) !== -1;

  const handleClick = () => {
    if (isSelected) setSelectedWants((prev) => prev.filter((x) => x._id !== item._id));
    if (!isSelected) {
      if (selectedWants.length >= 10) return;
      setSelectedWants((prev) => [...prev, item]);
    }
  };

  const handleLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div className='w-full relative select-none'>
      <div
        onClick={handleClick}
        className='flex pb-[100%] rounded-md bg-trade-item relative shadow-lg transition-all duration-300 hover:bg-trade-item-lighter cursor-pointer'>
        {isSelected && (
          <div className='absolute w-full h-full bg-black/50 rounded-md overflow-hidden z-40 group'>
            <div className='relative w-full h-full flex justify-center items-center'>
              <CheckCircleIcon className='absolute h-14 md:h-16 lg:h-20 text-emerald-700 transition-all duration-300 group-hover:opacity-0' />
              <XCircleIcon className='absolute h-14 md:h-16 lg:h-20 text-rose-700 opacity-0 transition-all duration-300 group-hover:opacity-100' />
            </div>
          </div>
        )}
        <div
          style={{
            border: `${'#' + (item.color || 'FFFFFF')} solid ${item.color ? 2 : 0}px`,
          }}
          className='absolute flex rounded-md overflow-hidden items-center justify-center w-full h-full p-2'>
          <div className={`w-full h-[6px] absolute top-0 left-0`}></div>
          {(item.pic || item.picLarge) && (
            <img
              onLoad={handleLoad}
              className={`absolute px-2 opacity-0 transition-opacity duration-300 ${
                imgLoaded && 'opacity-100'
              }`}
              src={item.pic || item.picLarge}
              alt=''
            />
          )}
          {!item.pic && !item.picLarge && <PhotoIcon className='absolute px-2 h-14' />}
          {/* Name + Prefixes */}
          <div className='absolute top-2 flex flex-col w-full justify-center items-center py-1 xs:bg-black/30'>
            {item.isStatTrak && (
              <p className='text-xs text-center px-3 text-[#CF6A32] font-semibold'>StatTrak™</p>
            )}
            {item.isSouvenir && (
              <p className='text-xs text-center px-3 text-[#FFD700] font-semibold'>Souvenir</p>
            )}
            <p className='hidden xs:block text-xs text-center px-3'>
              {item.wear === 'no float' && !item.market_hash_name.includes('Music Kit')
                ? item.market_hash_name || 'not registered'
                : item.pureName || 'not registered'}
            </p>
          </div>

          {/* Exteriors */}
          {item.wear !== 'no float' && (
            <div className='absolute w-full h-full flex items-center justify-center'>
              {/* Wear 1 */}
              <p className='absolute hidden xs:block xl:hidden bottom-2 left-2 text-xs text-center px-3'>
                {item.wear}
              </p>
              <p className='absolute xs:hidden top-2 left-2 text-xs text-center px-3'>{item.wear}</p>
              {/* Wear 2 */}
              <p className='absolute bottom-2 left-2 text-xs text-center px-3 hidden xl:block'>
                {item.longerWear}
              </p>
            </div>
          )}
          <p className='absolute bottom-1 presm:bottom-2 right-1 presm:right-2 text-sm text-center px-2 font-bold text-shadow-outline font-rubik text-rose-500 drop-shadow-md'>
            {item.price === 'unknown price' ? 'no price' : item.price || 'no price'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WantsItem;
