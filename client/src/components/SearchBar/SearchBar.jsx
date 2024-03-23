import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeSearchTerm } from '../../features/trades/tradesSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ cb }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changeSearchTerm(searchTerm));
    setSearchTerm('');
    cb && cb();
  };

  return (
    <form className='h-10 flex flex-1 rounded-xl bg-zinc-800' onSubmit={handleSubmit}>
      <MagnifyingGlassIcon
        onClick={handleSubmit}
        className='h-6 my-auto px-3 text-zinc-500 cursor-pointer'
      />
      <input
        autoComplete='false'
        className='text-sm sm:text-md flex-1 bg-transparent outline-none placeholder-zinc-400'
        placeholder='Search for trades...'
        type='text'
        value={searchTerm}
        onChange={handleChange}
      />
      <button hidden></button>
    </form>
  );
};

export default SearchBar;
