import { useDispatch } from 'react-redux';
import { toggleLoginModal } from '../../features/user/userSlice';

const LoginButton = ({
  styling = 'px-7 py-[6px] z-10 cursor-pointer rounded-lg shadow-lg text-white',
}) => {
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    dispatch(toggleLoginModal(true));
  };

  return (
    <div className='relative'>
      <div className='relative flex justify-center items-center overflow-hidden rounded-lg group'>
        <button onClick={handleOpenModal} className={styling}>
          Log In
        </button>
        <div className='absolute -top-16 -bottom-16 -right-5 -left-5 transition-all duration-500 group-hover:rotate-[135deg] bg-gradient-to-br from-zinc-500 to-gray-800'></div>
      </div>
    </div>
  );
};

export default LoginButton;
