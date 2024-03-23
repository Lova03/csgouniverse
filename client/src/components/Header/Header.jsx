import { NavLink } from 'react-router-dom';

import banner from '../../images/banner_d.png';
import logo from '../../images/logo_w.png';

const Header = () => {
  return (
    <header
      style={{ backgroundImage: `url(${banner})` }}
      className={`flex h-24 justify-center px-12 flex-col space-y-5 md:space-y-0 md:flex-row items-center sm:items-start md:items-center md:justify-between bg-cover bg-no-repeat`}>
      <NavLink to='/' className='sm:ml-5'>
        <img src={logo} alt='' className='w-56 sm:w-80' />
      </NavLink>
    </header>
  );
};

export default Header;
