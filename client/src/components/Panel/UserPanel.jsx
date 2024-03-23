import { useSelector } from 'react-redux';
import { selectUser } from '../../features/user/userSlice';
import Notifications from './Notifications';
import ProfileOptions from './ProfileOptions';

const UserPanel = () => {
  const user = useSelector(selectUser);

  const handleLogout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, '_self');
  };

  return (
    <div className='relative select-none flex space-x-3 items-center'>
      <Notifications />
      <ProfileOptions user={user} handleLogout={handleLogout} />
    </div>
  );
};

export default UserPanel;
