import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeItemsSearchTerm,
  fetchItems,
  selectItems,
  selectItemsHasError,
  selectItemsIsLoading,
  selectItemsSearchTerm,
  selectMoreToLoad,
} from '../../features/items/itemsSlice';
import {
  fetchUserItems,
  selectHasItemsError,
  selectIsItemsLoading,
  selectIsUserLoading,
  selectUser,
  selectUserItems,
} from '../../features/user/userSlice';
import LoginButton from '../LoginButton/LoginButton';
import OfferingItem from '../OfferingItem/OfferingItem';
import TradeButton from '../TradeButton/TradeButton';
import WantsItem from '../WantsItem/WantsItem';

const CreateTradeFormModal = ({ setOpened, selected, setSelected, offers, wants }) => {
  const itemsBox = useRef(null);

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsUserLoading);
  const isLoggedIn = Object.keys(user).length > 0;

  const userItems = useSelector(selectUserItems);
  const isUserItemsLoading = useSelector(selectIsItemsLoading);
  const hasUserItemsError = useSelector(selectHasItemsError);

  const items = useSelector(selectItems);
  const itemsIsLoading = useSelector(selectItemsIsLoading);
  const itemsHasError = useSelector(selectItemsHasError);
  const moreToLoad = useSelector(selectMoreToLoad);

  const search = useSelector(selectItemsSearchTerm);

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [typing, setTyping] = useState(false);
  const handleChange = (e) => {
    dispatch(changeItemsSearchTerm(e.target.value));
    setSearchTerm(e.target.value);
    setTyping(true);
  };
  const clearSearch = () => {
    setSearchTerm('');
    dispatch(changeItemsSearchTerm(''));
    setTyping(true);
  };

  useEffect(() => {
    const fetchQueryItems = setTimeout(() => {
      if (wants) {
        setCurrentPage(1);
        dispatch(fetchItems({ query: search, page: 1, ct: false }));
        setTyping(false);
      }
    }, 1000);

    return () => clearTimeout(fetchQueryItems);
  }, [dispatch, search, wants]);
  const fetchMore = () => {
    dispatch(fetchItems({ query: search, page: currentPage + 1, ct: true }));
    setCurrentPage((prev) => prev + 1);
  };
  const handleInfiniteScrolling = () => {
    const scrollY = itemsBox.current.scrollHeight - itemsBox.current.scrollTop;
    const height = itemsBox.current.offsetHeight;
    const offset = height - scrollY;
    if (offset > -100 && !itemsIsLoading && moreToLoad) {
      fetchMore();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changeItemsSearchTerm(searchTerm));
  };
  const refetchUserItems = () => {
    dispatch(fetchUserItems());
  };
  return (
    <div className={`flex fixed justify-center items-center w-screen h-screen top-0 left-0 z-50`}>
      <div
        className='absolute w-screen h-screen bg-black/40 top-0 left-0'
        onClick={() => setOpened(false)}></div>

      <div
        className={`w-5/6 h-5/6 bg-lighter-black rounded-lg shadow-lg z-10 p-3 relative flex flex-col`}>
        <div className='h-8 w-full flex items-center relative'>
          {(isLoggedIn || wants) && !isLoading && (
            <div>
              {offers && <span className='hidden md:block ml-10'>Click on items you want to offer</span>}
              {wants && <span className='hidden md:block ml-10'>Click on items you want to get</span>}
              {offers && (
                <span className='md:hidden ml-3 text-sm sm:text-base'>Select items to offer</span>
              )}
              {wants && <span className='md:hidden ml-3 text-sm sm:text-base'>Select items to get</span>}
            </div>
          )}
          <XMarkIcon
            onClick={() => setOpened(false)}
            className='cursor-pointer h-8 ml-auto transition-all duration-200 hover:text-rose-800'
          />
        </div>
        {!isLoggedIn && !isLoading && !wants && (
          <div className='relative flex-1 flex justify-center items-center overflow-hidden'>
            <div className='flex flex-col space-y-5 items-center justify-center'>
              <span>You need to log in first</span>
              <LoginButton styling='px-10 border-solid border-2 border-zinc-500/50 py-3 z-10 cursor-pointer rounded-lg shadow-lg text-white' />
            </div>
          </div>
        )}
        {isLoading && (
          <div className='flex flex-1 justify-center items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-zinc-800 border-t-zinc-600'></div>
          </div>
        )}
        {offers && isLoggedIn && (
          <div className='grid gap-2 pr-1 my-5 grid-cols-2 presm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 overflow-y-scroll'>
            {userItems.success &&
              userItems &&
              userItems.items.map((item, idx) => (
                <OfferingItem
                  item={item}
                  selectedHas={selected}
                  setSelectedHas={setSelected}
                  key={idx}
                />
              ))}
          </div>
        )}
        {offers && isLoggedIn && (!userItems || !userItems.success) && (
          <div className='flex flex-1 flex-col space-y-5 items-center justify-center select-none'>
            {hasUserItemsError && <span>Failed to fetch inventory</span>}
            {!isUserItemsLoading && (
              <TradeButton
                handleClick={refetchUserItems}
                text='Refresh'
                color='from-sky-300 to-sky-800'
              />
            )}
            {isUserItemsLoading && (
              <div className='flex flex-1 justify-center items-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-4 border-zinc-800 border-t-zinc-600'></div>
              </div>
            )}
          </div>
        )}
        {wants && (
          <div className='w-full my-2 px-2 py-1'>
            <form
              className='h-10 flex flex-1 mb-auto rounded-xl bg-trade-item-lighter'
              onSubmit={handleSubmit}>
              <MagnifyingGlassIcon
                onClick={handleSubmit}
                className='h-6 my-auto px-3 text-zinc-500 cursor-pointer'
              />
              <input
                autoComplete='false'
                className='text-sm sm:text-md flex-1 bg-transparent outline-none placeholder-zinc-400'
                placeholder='Search for skins...'
                type='text'
                value={search}
                onChange={handleChange}
              />
              {search.length > 0 && (
                <XMarkIcon
                  onClick={clearSearch}
                  className='h-6 my-auto px-3 text-zinc-500 cursor-pointer'
                />
              )}
              <button hidden></button>
            </form>
          </div>
        )}
        {wants &&
          !itemsHasError &&
          (!itemsIsLoading || items.data?.length > 0) &&
          !typing &&
          items.data && (
            <div
              ref={itemsBox}
              onScroll={handleInfiniteScrolling}
              className='grid gap-2 pr-1 my-2 grid-cols-2 presm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 overflow-y-scroll'>
              {items.data?.map((item, idx) => (
                <WantsItem
                  item={item}
                  selectedWants={selected}
                  setSelectedWants={setSelected}
                  key={idx}
                />
              ))}
            </div>
          )}
        {wants && itemsHasError && (
          <div className='flex-1 flex justify-center items-center'>
            <span>Failed to fetch items from our database</span>
          </div>
        )}
        {wants && !itemsHasError && !itemsIsLoading && !typing && items.data?.length === 0 && (
          <div className='flex flex-1 justify-center items-center flex-col space-y-4'>
            <span>No items found for this search</span>
            <TradeButton handleClick={clearSearch} text='Clear Search' color='from-sky-300 to-sky-800' />
          </div>
        )}
        {wants && (typing || itemsIsLoading || (!items.data && !itemsHasError)) && (
          <div className='flex flex-1 justify-center items-center'>
            <div className='animate-spin my-2 rounded-full h-12 w-12 border-4 border-zinc-800 border-t-zinc-600'></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTradeFormModal;
