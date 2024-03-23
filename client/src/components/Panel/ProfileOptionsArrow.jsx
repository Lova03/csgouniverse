import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const Arrow = ({ opened }) => {
  return (
    <div className='relative'>
      <div className='hello absolute w-full h-full'></div>
      {opened ? (
        <ChevronUpIcon
          className={`h-4 transition-all ${
            opened ? 'text-rose-800' : 'text-inherit'
          } duration-300 group-hover:text-rose-800`}
        />
      ) : (
        <ChevronDownIcon
          className={`h-4 transition-all ${
            opened ? 'text-rose-800' : 'text-inherit'
          } duration-300 group-hover:text-rose-800`}
        />
      )}
    </div>
  );
};

export default Arrow;
