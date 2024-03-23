import { useEffect } from 'react';
import { useState } from 'react';
import Meteor from './Meteor';

const MeteorRainContainer = ({ count, modulo }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const meteorArray = new Array(count).fill(null);

  return (
    <div className='-z-10 fixed w-screen h-screen'>
      {meteorArray.map((_, idx) => {
        return (
          <Meteor
            idx={idx}
            delay={(((idx % modulo) + 1) * Math.floor(Math.random() * 350 + 200)) / 100}
            width={width}
            height={height}
            key={idx}
          />
        );
      })}
    </div>
  );
};

export default MeteorRainContainer;
