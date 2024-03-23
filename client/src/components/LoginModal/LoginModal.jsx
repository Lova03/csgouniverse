import { CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from '../../features/user/userSlice';
import logo from '../../images/logo_w.png';
import banner from '../../images/banner_d.png';
import bgPic from '../../images/login_bg_pic.png';

const signInPic =
  'https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png';

const LoginModal = () => {
  const modal = useRef(null);
  const dispatch = useDispatch();

  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [pingTerms, setPingTerms] = useState(false);
  const [pingPrivacy, setPingPrivacy] = useState(false);

  const [hovered, setHovered] = useState(false);

  const handleCloseModal = ({ target }) => {
    if (modal.current.contains(target)) return;
    dispatch(toggleLoginModal(false));
  };
  const forceCloseModal = () => dispatch(toggleLoginModal(false));

  const handleTermsCheck = () => {
    if (pingTerms) setPingTerms(false);
    setTerms((prev) => !prev);
  };

  const handlePrivacyCheck = () => {
    if (pingPrivacy) setPingPrivacy(false);
    setPrivacy((prev) => !prev);
  };

  const pingT = () => {
    setPingTerms(false);
    setTimeout(() => {
      setPingTerms(true);
    }, 1);
  };
  const pingP = () => {
    setPingPrivacy(false);
    setTimeout(() => {
      setPingPrivacy(true);
    }, 1);
  };

  const handleClick = () => {
    if (!terms) pingT();
    if (!privacy) pingP();
    if (!terms || !privacy) return;
    handleLogin();
  };

  const handleLogin = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/steam`, '_self');
  };

  const handleEnter = () => setHovered(true);
  const handleLeave = () => setHovered(false);

  return (
    <div
      onClick={handleCloseModal}
      className='fixed isolate z-50 top-0 left-0 flex justify-center items-center overflow-hidden w-screen h-screen bg-black/40 select-none'>
      <div
        ref={modal}
        className={`flex flex-col bg-zinc-800 transition-all duration-300 ${
          hovered && terms && privacy ? 'xs:shadow-slight-shine' : 'xs:shadow-lg'
        } rounded-none xs:rounded-lg overflow-hidden w-full xs:w-[475px] h-[88%] min-h-[340px] isolate`}>
        {/* Banner */}
        <div
          className='w-full grid place-items-center pb-16 pt-16 bg-cover bg-no-repeat bg-left'
          style={{ backgroundImage: `url(${banner})` }}>
          <img src={logo} className='w-5/6' alt='' />
        </div>

        {/* Body under banner */}
        <div className='flex-1 flex flex-col relative'>
          <div className='-z-10 absolute w-full h-full'>
            <img className='absolute -right-48 grayscale opacity-20' src={bgPic} alt='' />
          </div>
          <div className='flex-1 relative flex flex-col justify-center items-center z-20'>
            <span className='text-xl text-white'>Log in using Steam</span>
            <button
              onClick={handleClick}
              className='cursor-pointer mt-6'
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}>
              <img src={signInPic} alt='' />
            </button>

            <div className='flex flex-col justify-center items-start space-y-2 mt-6'>
              <div className='flex space-x-3 items-center'>
                <div
                  onClick={handleTermsCheck}
                  className={`h-6 w-6 flex relative justify-center items-center border-2 border-solid transition-all duration-100 ${
                    terms ? 'border-trade-item-lighter' : 'border-rose-800/50 '
                  } rounded-sm md:rounded-md bg-trade-item hover:cursor-pointer`}>
                  {pingTerms && (
                    <div className='absolute h-6 w-6 rounded-sm md:rounded-md border-rose-800 border-solid border-2 animate-ping-once'></div>
                  )}
                  {terms && <CheckIcon className='h-6 text-emerald-700' />}
                </div>
                <p className='text-sm cursor-pointer'>
                  <span onClick={handleTermsCheck}>I accept and agree to </span>
                  <span className='font-bold hover:text-rose-800 transition-all duration-200 underline underline-offset-2'>
                    Terms and Conditions
                  </span>
                </p>
              </div>
              <div className='flex space-x-3 items-center'>
                <div
                  onClick={handlePrivacyCheck}
                  className={`h-6 w-6 flex justify-center items-center border-2 border-solid transition-all duration-100 ${
                    privacy ? 'border-trade-item-lighter' : 'border-rose-800/50 '
                  } rounded-sm md:rounded-md bg-trade-item hover:cursor-pointer`}>
                  {pingPrivacy && (
                    <div className='absolute h-6 w-6 rounded-sm md:rounded-md border-rose-800 border-solid border-2 animate-ping-once'></div>
                  )}
                  {privacy && <CheckIcon className='h-6 text-emerald-700' />}
                </div>
                <p className='text-sm cursor-pointer'>
                  <span onClick={handlePrivacyCheck}>I accept and agree to </span>
                  <span className='font-bold hover:text-rose-800 transition-all duration-200 underline underline-offset-2'>
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center mt-auto pb-8 z-20'>
            <button
              onClick={forceCloseModal}
              className='cursor-pointer rounded-full overflow-hidden transition-all duration-300 hover:text-rose-800'>
              <XCircleIcon className='h-16 stroke-1' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
