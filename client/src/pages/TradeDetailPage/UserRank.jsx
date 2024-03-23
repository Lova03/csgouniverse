import { Link } from 'react-router-dom';

const UserRank = ({ name, rank, id, Icon, color }) => {
  return (
    <div className='py-4 flex flex-col space-y-3 items-start'>
      <div className='flex space-x-2 justify-center items-center text-base'>
        <Icon className='h-4' />
        <span>{rank}</span>
      </div>
      <Link className={`md:hidden text-lg font-semibold cursor-pointer ${color}`} to={`/users/${id}`}>
        {name.length > 12 ? `${name.slice(0, 12)}...` : name}
      </Link>
      <Link
        className={`hidden md:block text-lg font-semibold cursor-pointer ${color}`}
        to={`/users/${id}`}>
        {name}
      </Link>
    </div>
  );
};

export default UserRank;
