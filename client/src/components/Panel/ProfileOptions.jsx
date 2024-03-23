import { useRef, useState, useEffect } from 'react';
import {
  ClockIcon,
  Cog6ToothIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  StarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import ProfileOptionsArrow from './ProfileOptionsArrow';

const ProfileOptions = ({ user, handleLogout }) => {
  const [opened, setOpened] = useState(false);
  const profilebox = useRef(null);

  const handleClick = () => {
    setOpened((prev) => !prev);
  };

  useEffect(() => {
    const check = ({ target }) => {
      if (!opened) return;
      if (profilebox.current.contains(target)) return;
      setOpened(false);
    };
    window.addEventListener('click', check);
    return () => {
      window.removeEventListener('click', check);
    };
  }, [opened]);

  return (
    <div ref={profilebox} className='relative'>
      <div
        onClick={handleClick}
        className='relative flex items-center justify-center group cursor-pointer'>
        <img className='rounded-full h-9' src={user.profilePic} alt='' />
        <ProfileOptionsArrow opened={opened} />
      </div>
      <div
        className={`absolute ${
          opened ? 'flex' : 'hidden'
        } top-[117%] w-48 p-3 right-0 bg-zinc-800 flex-col shadow-2xl rounded-md`}>
        <div className='flex items-center justify-center font-bold break-all mx-2 mb-1 h-12 border-b-zinc-600 border-b-[1px]'>
          <span>{user.username.length > 16 ? `${user.username.slice(0, 13)}...` : user.username}</span>
        </div>
        <div className='userpanelitem'>
          <UserIcon className='h-4' />
          <span>Profile</span>
        </div>
        <div className='userpanelitem'>
          <ClockIcon className='h-4' />
          <span>History</span>
        </div>
        <div className='userpanelitem'>
          <HeartIcon className='h-4' />
          <span>Favorites</span>
        </div>
        <div className='userpanelitem'>
          <StarIcon className='h-4' />
          <span>Premium</span>
        </div>
        <div className='userpanelitem'>
          <Cog6ToothIcon className='h-4' />
          <span>Settings</span>
        </div>
        <div onClick={handleLogout} className='userpanelitem'>
          <ArrowRightOnRectangleIcon className='h-4' />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileOptions;
