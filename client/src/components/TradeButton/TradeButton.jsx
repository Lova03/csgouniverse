const TradeButton = ({ handleClick, text, color }) => {
  return (
    <div className='relative flex justify-center items-center overflow-hidden rounded-lg group'>
      <button
        onClick={handleClick}
        className='px-6 py-3 z-10 cursor-pointer rounded-lg shadow-lg text-white'>
        {text}
      </button>
      <div
        className={`absolute -top-16 -bottom-16 -right-5 -left-5 transition-all duration-500 group-hover:rotate-[135deg] bg-gradient-to-br ${color}`}></div>
    </div>
  );
};

export default TradeButton;
