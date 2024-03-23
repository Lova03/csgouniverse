import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

const Notifications = () => {
  const [opened, setOpened] = useState(false);
  const notibox = useRef(null);

  const handleClick = () => {
    setOpened((prev) => !prev);
  };

  useEffect(() => {
    const check = ({ target }) => {
      if (!opened) return;
      if (notibox.current.contains(target)) return;
      setOpened(false);
    };
    window.addEventListener('click', check);
    return () => {
      window.removeEventListener('click', check);
    };
  }, [opened]);

  return (
    <div ref={notibox} className='notibox relative'>
      <div
        onClick={handleClick}
        className='p-1 rounded-full transition-all duration-150 bg-transparent cursor-pointer hover:text-rose-800 active:bg-zinc-500/10'>
        <BellIcon className={`h-6 ${opened ? 'text-rose-800' : 'text-inherit'}`} />
      </div>
      <div
        className={`fixed sm:absolute ${
          opened ? 'flex' : 'hidden'
        } top-[9rem] sm:top-[125%] w-[calc(100% - 2rem)] min-h-[8rem] py-3 px-2 left-8 sm:left-auto right-0 bg-zinc-800 flex-col space-y-2 shadow-2xl sm:rounded-md sm:w-96`}>
        <div className='flex justify-between items-center text-zinc-500'>
          <span className='ml-3 text-lg'>Notifications</span>
          <button
            onClick={handleClick}
            className='p-1 rounded-full transition-all duration-300 bg-transparent cursor-pointer hover:text-rose-800'>
            <XMarkIcon className='h-6' />
          </button>
        </div>
        <div className='px-2 py-2 min-h-[4rem] rounded-md cursor-pointer transition-all duration-200 hover:bg-zinc-700/40'>
          <span>Someone commented on your tradq f qfg+qegqg se!</span>
        </div>
        <div className='px-2 py-2 min-h-[4rem] rounded-md cursor-pointer transition-all duration-200 hover:bg-zinc-700/40'>
          <span>Someone commented on your trade!</span>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
