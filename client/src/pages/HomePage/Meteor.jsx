import React from 'react';
import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { animated, useSpring } from '@react-spring/web';

const MeteorV3 = ({ delay, width, height, idx }) => {
  const [position, setPosition] = useState({ x: (width - 40) * Math.random() + 20, y: -60 });
  const [finish, setFinish] = useState({ x: Math.random() * width * 2 - width / 2, y: height + 80 });
  const [speed, setSpeed] = useState(Math.floor(Math.random() * 30 + 10) / 10);
  const rng = Math.random();
  const [color, setColor] = useState(rng > 0.7 ? (rng > 0.9 ? '#F7DC6F' : '#3498DB') : '#FFFFFF');

  const angle = (Math.atan2(finish.y - position.y, finish.x - position.x) * 180) / Math.PI;

  const props = useSpring({
    from: {
      top: position.y,
      left: position.x,
    },
    to: {
      top: finish.y,
      left: finish.x,
    },
    reset: true,
    delay: delay * 1000,
    config: {
      duration: speed * 1000,
    },
  });

  useEffect(() => {
    const changeInterval = setInterval(() => {
      setPosition({ x: width * Math.random(), y: -60 });
      setFinish({ x: Math.random() * width * 2 - width / 2, y: height + 80 });
      setSpeed(Math.floor(Math.random() * 40 + 10) / 10);
      setColor(Math.random() > 0.7 ? (Math.random() > 0.66 ? '#F7DC6F' : '#CAEEFB') : '#FFFFFF');
    }, delay * 1000 + speed * 1000);

    return () => clearInterval(changeInterval);
  }, [width, height, speed, delay, idx]);

  return (
    <animated.div style={{ ...props, rotate: `${angle}deg` }} className='absolute animate-pulse'>
      <div
        style={{
          borderRight: `${(4 - speed + 3) * 15}px solid ${color}`,
          borderTop: '1px solid transparent',
          borderBottom: '1px solid transparent',
        }}
        className='absolute top-1/2 -translate-y-1/2 left-1 -translate-x-full'></div>
      <StarIcon
        style={{
          color: color,
        }}
        className='h-3'
      />
      <div
        style={{
          boxShadow: `0 0 10px #fff, 0 0 15px #fff, 0 0 20px ${color}, 0 0 25px ${color}, 0 0 30px ${color}20, 0 0 35px ${color}80, 0 0 40px ${color}`,
        }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1'></div>
    </animated.div>
  );
};

export default MeteorV3;
