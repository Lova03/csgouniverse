import { useEffect, useRef, useState } from 'react';

const settings = {
  reverse: -1,
  max: 10,
  perspective: 1000,
  scale: '1',
  axis: null,
};

const TradeItemImage = ({ pic }) => {
  const [coords, setCoords] = useState({});

  const item = useRef(null);

  const changePerspective = ({ clientX, clientY }) => {
    const values = getValues({ clientX, clientY });
    const style = `perspective(${settings.perspective}px) rotateX(${
      settings.axis === 'x' ? 0 : values.tiltY
    }deg) rotateY(${settings.axis === 'y' ? 0 : values.tiltX}deg) scale3d(${settings.scale}, ${
      settings.scale
    }, ${settings.scale})`;
    item.current.style.transform = style;
  };

  const handleMouseEnter = (e) => {
    changePerspective(e);
  };
  const handleMouseMove = (e) => {
    changePerspective(e);
  };
  const handleMouseLeave = (e) => {
    item.current.style.transform = `perspective(${settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const getValues = ({ clientX, clientY }) => {
    const x = (clientX - coords.left) / coords.width;
    const y = (clientY - coords.top) / coords.height;
    const _x = Math.min(Math.max(x, 0), 1);
    const _y = Math.min(Math.max(y, 0), 1);
    const tiltX = (settings.reverse * (settings.max / 2 - _x * settings.max)).toFixed(2);
    const tiltY = (settings.reverse * (_y * settings.max - settings.max / 2)).toFixed(2);
    const percentageX = _x * 100;
    const percentageY = _y * 100;

    return {
      tiltX,
      tiltY,
      percentageX,
      percentageY,
    };
  };

  useEffect(() => {
    const rect = item.current.getBoundingClientRect();
    setCoords((prev) => ({
      ...prev,
      width: item.current.offsetWidth,
      height: item.current.offsetHeight,
      left: rect.left,
      top: rect.top,
    }));
  }, []);

  return (
    <img
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={item}
      className='w-5/6 mx-auto p-2 mt-2 bg-trade-item rounded-lg shadow-lg'
      src={pic}
      alt=''
    />
  );
};

export default TradeItemImage;
