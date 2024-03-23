import tradeicon from '../../images/trade_icon.svg';
import TradeItem from './TradeItem';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/user/userSlice';

const Trade = ({ data }) => {
  const user = useSelector(selectUser);

  const owned = user.trades?.includes(data.id);

  const offersOtherItems = [...data.offers.other];
  const wantsOtherItems = [...data.wants.other];
  const offersOthersLength = offersOtherItems.length;
  const wantsOthersLength = wantsOtherItems.length;

  const itemsInARow = 4;

  const offersOtherSmallItems = offersOtherItems.splice(1, offersOthersLength);
  const wantsOtherSmallItems = wantsOtherItems.splice(1, wantsOthersLength);

  const offersRows = [];
  while (offersOtherSmallItems.length > itemsInARow)
    offersRows.push(offersOtherSmallItems.splice(0, itemsInARow));

  if (offersOtherSmallItems.length > 0) {
    while (offersOtherSmallItems.length < itemsInARow) offersOtherSmallItems.push(null);
    offersRows.push(offersOtherSmallItems);
  }

  const wantsRows = [];
  while (wantsOtherSmallItems.length > itemsInARow)
    wantsRows.push(wantsOtherSmallItems.splice(0, itemsInARow));

  if (wantsOtherSmallItems.length > 0) {
    while (wantsOtherSmallItems.length < itemsInARow) wantsOtherSmallItems.push(null);
    wantsRows.push(wantsOtherSmallItems);
  }

  // Temp
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritePing, setFavoritePing] = useState(false);
  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
    setFavoritePing(false);
    setTimeout(() => {
      setFavoritePing(true);
    }, 1);
  };

  return (
    <div
      className='relative w-5/6 select-none rounded-md md:rounded-lg bg-lighter-black
    flex flex-col space-y-5 max-w-lg md:max-w-xl xl:max-w-6xl'>
      {/* User Info */}
      <div className='flex space-x-2 pt-3 px-3 items-center rounded-t-md'>
        <img className='w-7 h-7 sm:w-11 sm:h-11 rounded-full' src={data.author.profilePic} alt='' />
        <p>
          <span style={{ wordBreak: 'break-all' }} className='font-bold'>
            {data.author.username}
          </span>{' '}
          wants to trade:
        </p>
      </div>

      {/* Trade Body */}
      <div className='flex relative flex-col px-3 space-y-5 xl:flex-row xl:space-y-0 xl:space-x-5'>
        {/* Trade - Offer 1 */}
        <div className={`relative w-full`}>
          <div className={offersOthersLength > 1 ? '' : 'xl:mt-[50%] xl:-translate-y-1/2'}>
            {/* Big items */}
            <div className='flex justify-center space-x-2'>
              <TradeItem highlight={true} item={data.offers.highlight} big offering />
              {offersOthersLength > 0 && <TradeItem item={data.offers.other[0]} big offering />}
            </div>
            {/* Small items */}
            {offersRows.map((row, index) => (
              <div key={index} className='flex justify-start space-x-2 mt-2'>
                {row.map((item, idx) => (
                  <TradeItem key={idx} item={item} offering />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Trade Icon */}
        <div className='flex items-center justify-center'>
          <img className='h-9 sm:h-12 md:h-14 xl:h-36 -rotate-90 xl:rotate-180' src={tradeicon} alt='' />
        </div>
        {/* Trade - Offer 2 */}
        <div className={`relative w-full`}>
          <div className={wantsOthersLength > 1 ? '' : 'xl:mt-[50%] xl:-translate-y-1/2'}>
            {/* Big items */}
            <div className='flex justify-center space-x-2'>
              <TradeItem highlight={true} item={data.wants.highlight} big />
              {wantsOthersLength > 0 && <TradeItem item={data.wants.other[0]} big />}
            </div>
            {/* Small items */}
            {wantsRows.map((row, index) => (
              <div key={index} className='flex justify-start space-x-2 mt-2'>
                {row.map((item, idx) => (
                  <TradeItem key={idx} item={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Info */}
      <div className='flex justify-center bg-white/5 space-x-4 pb-3 pt-1 px-3 rounded-b-md items-center md:justify-end flex-wrap'>
        {owned && (
          <button className='trade-button mr-auto bg-red-700'>
            <TrashIcon className='h-5' />
          </button>
        )}
        <Link to={`${data.id}`}>
          <button className='trade-button bg-green-700'>Detail</button>
        </Link>

        {data.author.tradeurl && (
          <a href={data.author.tradeurl} target='_blank' rel='noreferrer'>
            <button className='trade-button'>Tradelink</button>
          </a>
        )}
        <button
          onClick={handleFavoriteClick}
          className={`relative flex items-center justify-center trade-button transition-all duration-200 ${
            isFavorite ? ' bg-rose-700' : ''
          }`}>
          <HeartIcon className='h-5' />
          {favoritePing && <HeartIcon className='absolute h-5 animate-ping-once' />}
        </button>
      </div>
    </div>
  );
};

export default Trade;
