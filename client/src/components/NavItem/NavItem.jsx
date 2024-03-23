import { NavLink } from 'react-router-dom';

const NavItem = ({ opened, setOpened, text, to, Icon }) => {
  return (
    <NavLink
      to={to}
      end
      onClick={() => setOpened(false)}
      className={({ isActive }) => (isActive ? 'navitem group text-white' : 'navitem group')}>
      <div className='navitem-icon peer group'>
        <Icon className='h-4 sm:h-5' />
      </div>
      <div className={`navitem-text ${opened ? 'flex' : 'hidden'}`}>
        <span>{text}</span>
      </div>
    </NavLink>
  );
};

export default NavItem;
