import { CheckCircleIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';

const OfferingItem = ({ item, selectedHas, setSelectedHas }) => {
  const isSelected = selectedHas.findIndex((x) => x.assetid === item.assetid) !== -1;

  const { tradable } = item;

  const handleClick = () => {
    if (isSelected && tradable) setSelectedHas((prev) => prev.filter((x) => x.assetid !== item.assetid));
    if (!isSelected && tradable) {
      if (selectedHas.length >= 10) return;
      setSelectedHas((prev) => [...prev, item]);
    }
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
        {!tradable && (
          <div className='z-50 absolute w-full h-full bg-black/50 rounded-md overflow-hidden cursor-default'></div>
        )}
        <div
          style={{ border: `${'#' + (item.color || 'FFFFFF')} solid 2px` }}
          className='absolute flex rounded-md overflow-hidden items-center justify-center w-full h-full p-2'>
          <div className={`w-full h-[6px] absolute top-0 left-0`}></div>
          {(item.pic || item.picLarge) && (
            <img className='absolute px-2' src={item.pic || item.picLarge} alt='' />
          )}
          {!item.pic && !item.picLarge && <PhotoIcon className='absolute px-2 h-14' />}
          {/* Name & Prefixes */}
          <div
            className={`absolute top-2 flex flex-col w-full justify-center items-center py-1${
              !tradable ? '' : ' xs:bg-black/30'
            }`}>
            {item.isStatTrak && (
              <p className='text-xs text-center px-3 text-[#CF6A32] font-semibold'>StatTrak™</p>
            )}
            {item.isSouvenir && (
              <p className='text-xs text-center px-3 text-[#FFD700] font-semibold'>Souvenir</p>
            )}
            <p className='hidden xs:block text-xs text-center px-3'>
              {(item.wear === 'no float' || !item.wear) && !item.market_hash_name.includes('Music Kit')
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

          {/*  */}
          <div></div>

          {/* Price */}
          <p className='absolute bottom-1 presm:bottom-2 right-1 presm:right-2 text-sm text-center px-2 font-bold text-shadow-outline font-rubik text-rose-500 drop-shadow-md'>
            {item.price === 'unknown price' || !item.price ? '-$' : item.price || ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferingItem;
