import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectHasUserError, selectIsUserLoading, selectUser } from '../../features/user/userSlice';
import LoginButton from '../LoginButton/LoginButton';
import SearchBar from '../SearchBar/SearchBar';
import UserPanel from './UserPanel';

const Panel = () => {
  const [searchShown, setSearchShown] = useState(false);
  const location = useLocation();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsUserLoading);
  const hasError = useSelector(selectHasUserError);
  const loggedIn = Object.keys(user).length > 0;

  const handleSearchClick = () => {
    setSearchShown((prev) => !prev);
  };

  const hideSearchBar = () => {
    setSearchShown(false);
  };

  return (
    <div
      className={`relative z-20 flex ${
        location.pathname === '/trades' ? 'justify-end md:justify-between' : 'justify-end'
      } items-center space-x-3 sm:space-x-5 w-full h-12 px-4 sm:px-5 bg-black/30`}>
      {location.pathname === '/trades' && (
        <>
          <div className='flex flex-1 justify-center'>
            <div className='hidden md:block flex-1 max-w-3xl'>
              <SearchBar />
            </div>
          </div>
          <div className='block md:hidden'>
            <button
              onClick={handleSearchClick}
              className={`h-9 px-4 sm:px-6 rounded-lg transition-all ${
                searchShown ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-zinc-800 hover:bg-zinc-800/70'
              } text-sm`}>
              Search
            </button>
          </div>
        </>
      )}

      <div
        className={`absolute flex justify-center ${
          searchShown ? 'scale-100 opacity-70' : 'scale-0 opacity-0'
        } md:hidden transition-all duration-75 flex w-full top-[110%] -left-3 sm:-left-5 z-10 shadow-2xl`}>
        <div className='flex w-5/6'>
          <SearchBar cb={hideSearchBar} />
        </div>
      </div>

      {isLoading && (
        <div className='animate-spin rounded-full h-7 w-7 border-4 border-zinc-800 border-t-zinc-600'></div>
      )}

      {loggedIn && <UserPanel />}

      {((!loggedIn && !isLoading) || hasError) && <LoginButton />}
    </div>
  );
};

export default Panel;
