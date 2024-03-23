import Trade from '../../components/Trade/Trade';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeSearchTerm,
  changeShowDetailHover,
  changeShowDetailClick,
  selectFilteredTrades,
  selectHasError,
  selectIsLoading,
  selectSearchTerm,
  selectShowDetailHover,
  selectShowDetailClick,
  fetchTrades,
  selectMoreToLoadTrades,
} from '../../features/trades/tradesSlice';
import { useEffect, useRef, useState } from 'react';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CreateTradeForm from '../../components/CreateTradeForm/CreateTradeForm';
import TradeButton from '../../components/TradeButton/TradeButton';

const TradingPage = () => {
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tradesBox = useRef(null);

  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectHasError);
  const trades = useSelector(selectFilteredTrades);
  const searchTerm = useSelector(selectSearchTerm);
  const moreToLoad = useSelector(selectMoreToLoadTrades);

  const showDetailHover = useSelector(selectShowDetailHover);
  const showDetailClick = useSelector(selectShowDetailClick);
  const handleChangeShowDetailHover = () => {
    dispatch(changeShowDetailHover(!showDetailHover));
  };
  const handleChangeShowDetailClick = () => {
    dispatch(changeShowDetailClick(!showDetailClick));
  };

  useEffect(() => {
    setCurrentPage(1);
    dispatch(fetchTrades({ query: searchTerm, page: 1, ct: false }));
  }, [dispatch, searchTerm]);

  const fetchMore = () => {
    dispatch(fetchTrades({ query: searchTerm, page: currentPage + 1, ct: true }));
    setCurrentPage((prev) => prev + 1);
  };
  const handleInfiniteScrolling = () => {
    const scrollY = tradesBox.current.scrollHeight - tradesBox.current.scrollTop;
    const height = tradesBox.current.offsetHeight;
    const offset = height - scrollY;
    if (offset > -100 && !isLoading && moreToLoad) {
      fetchMore();
    }
  };

  const handleSearchReset = () => {
    dispatch(changeSearchTerm(''));
  };

  const handleClick = () => {
    setShowCreateButton(false);
  };

  const handleRefreshTrades = () => {
    dispatch(fetchTrades({ query: searchTerm, page: currentPage - 1, ct: true }));
  };

  return (
    <div
      ref={tradesBox}
      onScroll={handleInfiniteScrolling}
      className='py-5 flex flex-col space-y-5 items-center h-trade overflow-auto overflow-x-hidden'>
      {/* Create Trade */}
      {showCreateButton && (
        <div className='w-5/6 flex justify-center my-8'>
          <TradeButton
            handleClick={handleClick}
            text='CREATE TRADE'
            color='from-emerald-300 to-emerald-800'
          />
        </div>
      )}
      {!showCreateButton && <CreateTradeForm setShowCreateButton={setShowCreateButton} />}
      {/* Options */}
      <div className='hidden md:flex space-x-12 w-11/12 md:w-5/6 my-8 select-none'>
        <div className='flex space-x-3 items-center'>
          <p className='text-xs md:text-base uppercase'>
            Show item details on <span className='font-bold'>hover</span>
          </p>
          <div
            className='h-6 w-6 md:h-8 md:w-8 flex justify-center items-center border-2 border-solid border-trade-item-lighter rounded-sm md:rounded-md bg-trade-item hover:cursor-pointer'
            onClick={handleChangeShowDetailHover}>
            {showDetailHover && <CheckIcon className='h-4 md:h-6 text-emerald-700' />}
          </div>
        </div>
        <div className='flex space-x-3 items-center'>
          <p className='text-xs md:text-base uppercase'>
            Show item details on <span className='font-bold'>click</span>
          </p>
          <div
            className='h-6 w-6 md:h-8 md:w-8 flex justify-center items-center border-2 border-solid border-trade-item-lighter rounded-sm md:rounded-md bg-trade-item hover:cursor-pointer'
            onClick={handleChangeShowDetailClick}>
            {showDetailClick && <CheckIcon className='h-4 md:h-6 text-emerald-700' />}
          </div>
        </div>
      </div>
      {/* Search Results Text */}
      {searchTerm.length > 0 && (
        <div className='flex space-x-1 sm:space-x-3 text-xs sm:text-base w-full px-8 items-center'>
          <button
            onClick={handleSearchReset}
            className='font-semibold transition-all duration-100 hover:text-zinc-400'>
            All trades
          </button>
          <ChevronRightIcon className='h-4' />
          <span>Search results for "{searchTerm}"</span>
        </div>
      )}
      {/* Trades */}
      {trades.length === 0 && searchTerm !== '' && !isLoading && (
        <div className='w-5/6 max-w-sm py-16 flex flex-col space-y-4 justify-center items-center'>
          <span className='text-xl'>No trades found</span>
          <button
            onClick={handleSearchReset}
            className='py-2 px-6 rounded-md text-sm bg-trade-item shadow-md transition-all duration-200 hover:bg-trade-item-lighter'>
            Clear Search
          </button>
        </div>
      )}
      {hasError && (
        <div className='flex flex-1 justify-center items-center'>
          <p>Failed to fetch trades from our database</p>
        </div>
      )}
      {trades.map((trade, idx) => (
        <Trade key={idx} data={trade} />
      ))}
      {(isLoading || (!trades && !hasError)) && (
        <div className='flex flex-1 justify-center items-center'>
          <div className='animate-spin my-2 rounded-full h-12 w-12 border-4 border-zinc-800 border-t-zinc-600'></div>
        </div>
      )}
      {!isLoading && !moreToLoad && trades.length > 0 && (
        <div className='my-3 flex flex-col space-y-2 items-center justify-center'>
          <span>No more trades to load</span>
          <TradeButton
            handleClick={handleRefreshTrades}
            text='REFRESH'
            color='from-sky-300 to-sky-800'
          />
        </div>
      )}

      {!isLoading && trades.length === 0 && searchTerm === '' && (
        <div className='my-3 flex flex-col space-y-2 items-center justify-center'>
          {!hasError && <span>No trades found</span>}
          <TradeButton
            handleClick={handleRefreshTrades}
            text='REFRESH'
            color='from-sky-300 to-sky-800'
          />
        </div>
      )}
    </div>
  );
};

export default TradingPage;
