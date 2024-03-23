import { useEffect, useState } from 'react';
import NavItem from '../NavItem/NavItem';

import {
  ArrowsRightLeftIcon,
  Bars3Icon,
  UserCircleIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

const Navbar = ({ opened, setOpened }) => {
  const [overflow, setOverflow] = useState(null);
  useEffect(() => {
    const isOverflown = ({ scrollHeight, clientHeight }) => scrollHeight > clientHeight;
    const nav = document.querySelector('nav');
    setOverflow(isOverflown(nav));
    const res = () => {
      const el = nav;
      setOverflow(isOverflown(el));
    };
    window.addEventListener('resize', res);
    return () => {
      window.removeEventListener('resize', res);
    };
  }, []);

  return (
    <div className='absolute flex z-30 isolate'>
      <nav
        className={`relative overflow-y-auto overflow-x-hidden shadow-2xl lg:shadow-none bg-zinc-800 h-nav transition-all duration-100 select-none text-zinc-400 ${
          opened ? 'w-52 sm:w-64' : overflow ? 'w-10 sm:w-14' : 'w-8 sm:w-12'
        }
      }`}>
        <div className='navitem justify-end bg-red-700/50'>
          <div
            onClick={() => setOpened((prev) => !prev)}
            className='cursor-pointer mr-[4px] sm:mr-[2px]'>
            <Bars3Icon className='h-6 sm:h-11 sm:p-2 text-slate-100' />
          </div>
        </div>
        <NavItem
          opened={opened}
          setOpened={setOpened}
          text='Trades'
          to='/trades'
          Icon={ArrowsRightLeftIcon}
        />
        <NavItem
          opened={opened}
          setOpened={setOpened}
          text='Profile'
          to='/profile'
          Icon={UserCircleIcon}
        />
        <NavItem opened={opened} setOpened={setOpened} text='History' to='/history' Icon={ClockIcon} />
        <NavItem
          opened={opened}
          setOpened={setOpened}
          text='Favorites'
          to='/favorites'
          Icon={HeartIcon}
        />
        <NavItem opened={opened} setOpened={setOpened} text='Premium' to='/premium' Icon={StarIcon} />
        <NavItem opened={opened} setOpened={setOpened} text='Donators' to='/donators' Icon={GiftIcon} />
      </nav>
      {opened && (
        <div
          onClick={() => setOpened(false)}
          className='absolute -z-10 bg-black/40 w-screen h-full lg:hidden'></div>
      )}
    </div>
  );
};

export default Navbar;
