import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

const FloatValueBar = ({ float, min, max }) => {
  const floatRef = useRef(null);
  const containerRef = useRef(null);

  const handleClick = () => {
    const { offsetWidth, scrollWidth } = floatRef.current;
    const { offsetWidth: oc, scrollWidth: sc } = containerRef.current;
    if (offsetWidth < scrollWidth) {
      console.log('Text is overflowing');
    } else {
      console.log('Text is not overflowing');
    }
    console.log(oc);
    console.log(sc);
  };

  const numOfDigits = 4;
  const getRoundedFloat = () => {
    if (float === 1) return '1.0';
    if (float === 0) return '0.0';
    let str = float.toString();
    str = str.slice(2, -1);
    let zeros = 0;
    while (str[zeros] === '0') zeros++;
    str = str.slice(0, zeros + numOfDigits);
    return '0.' + str;
  };

  const getTextPosition = () => {
    const floatStringLength = ('Float: ' + getRoundedFloat()).length;
    const extra = floatStringLength - 13;
    const max = 264 - 70 - extra * 10;
    const px = 264 * float;

    if (px >= max) return { right: 0 };

    const perc = float * 100;

    return { left: `${perc}%` };
  };
  const getArrowPosition = () => float * 100;

  return (
    <div
      ref={containerRef}
      className='flex flex-col w-full h-12 pb-2 justify-end relative isolate whitespace-nowrap'>
      <div ref={floatRef} style={getTextPosition()} className={`absolute text-xs top-0`}>
        Float: <span className='font-semibold'>{getRoundedFloat()}</span>
      </div>
      <div
        onClick={handleClick}
        style={{ left: `${getArrowPosition()}%` }}
        className='absolute top-4 -translate-x-1/2'>
        <ChevronDownIcon className='h-4' />
      </div>
      <div className='w-full flex h-3 relative rounded-md overflow-hidden'>
        {/* Factory new */}
        <div className='w-[7%] bg-sky-400'></div>
        {/* Minimal wear */}
        <div className='w-[8%] bg-green-500'></div>
        {/* Field tested */}
        <div className='w-[23%] bg-yellow-400'></div>
        {/* Well worn */}
        <div className='w-[7%] bg-orange-500'></div>
        {/* Battle scarred */}
        <div className='w-[65%] bg-rose-700'></div>
      </div>
    </div>
  );
};

export default FloatValueBar;
