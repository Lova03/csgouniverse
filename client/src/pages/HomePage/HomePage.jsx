import bgPic2 from '../../images/homepage_bg_pic2.png';
import logo from '../../images/logo_w.png';
import logoS from '../../images/logo.svg';
import MeteorRainContainer from './MeteorRainContainer';
import Stars from './Stars';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [imageLoaded, setImageLoaded] = useState({ hei: false, logoLarge: false, logoSmall: false });
  const handleLoad = (e) => {
    const { id } = e.target;
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className='isolate relative flex flex-col flex-1 overflow-hidden select-none'>
      <Stars count={100} />
      <MeteorRainContainer count={5} modulo={5} />
      <div className='-z-30 w-screen h-screen bg-gradient-to-b from-transparent to-slate-900 fixed'></div>
      {/* Main */}
      <div className='z-10 flex flex-col items-center justify-start flex-1 py-14 h-screen w-screen'>
        <img
          onLoad={handleLoad}
          id='logoLarge'
          className={`mt-24 animate-float-4 relative px-16 z-10 hidden presm:block opacity-0 transition-opacity duration-300${
            imageLoaded.logoLarge && ' opacity-100'
          }`}
          src={logo}
          alt=''
        />
        <img
          onLoad={handleLoad}
          id='logoSmall'
          className={`mt-24 animate-float-4 relative px-16 z-10 invert presm:hidden opacity-0 transition-opacity duration-300${
            imageLoaded.logoLarge && ' opacity-100'
          }`}
          src={logoS}
          alt=''
        />
        <p className='text-4xl font-rubik opacity-70'>
          beta <span className='text-xl'>v1.0</span>
        </p>

        {/* Buttons */}
        <div className='flex-1 flex justify-center items-center'>
          {/* Button trading */}
          <Link to='trades' className='relative flex justify-center items-center rounded-lg isolate'>
            <button className='px-12 py-6 z-10 cursor-pointer rounded-lg overflow-hidden shadow-lg text-white relative isolate group'>
              START TRADING
              <div className='absolute h-[350%] w-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all -z-10 duration-500 group-hover:rotate-[135deg] bg-gradient-to-br from-rose-900 to-rose-500'></div>
            </button>
            <div className='absolute flex items-center justify-center animate-ping-s w-full h-full -z-10 border-solid border-2 border-rose-700/80 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'></div>
          </Link>
        </div>
      </div>
      {/* Bg pics */}
      <img
        onLoad={handleLoad}
        id='hei'
        className={`z-0 grayscale animate-float-s-8 absolute -left-48 -bottom-12 opacity-0 transition-opacity duration-300${
          imageLoaded.hei && ' opacity-50'
        }`}
        src={bgPic2}
        alt=''
      />
    </div>
  );
};

export default HomePage;
