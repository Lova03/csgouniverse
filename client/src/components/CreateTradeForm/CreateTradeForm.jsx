import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import TradeButton from '../TradeButton/TradeButton';
import CreateTradeFormItem from './CreateTradeFormItem';
import CreateTradeFormModal from './CreateTradeFormModal';

const CreateTradeForm = ({ setShowCreateButton }) => {
  const [selectedHas, setSelectedHas] = useState([]);
  const [selectedWants, setSelectedWants] = useState([]);
  const [creating, setCreating] = useState(false);

  const [offeringOpened, setOfferingOpened] = useState(false);
  const handleClickOffering = () => {
    setOfferingOpened(true);
  };
  const [wantsOpened, setWantsOpened] = useState(false);
  const handleClickWants = () => {
    setWantsOpened(true);
  };

  const [addiInfo, setAddiInfo] = useState('');
  const maxLines = 10;

  const handleChange = (e) => {
    const { target } = e;
    const lines = target.value.split('\n').length;
    if (lines >= maxLines) {
      e.preventDefault();
      const newValue = target.value.split('\n').slice(0, maxLines).join('\n');
      setAddiInfo(newValue);
      return;
    }
    setAddiInfo(target.value);
  };
  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === 'Enter') {
      const lines = addiInfo.split('\n').length;
      if (lines >= maxLines) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleCancelClick = () => {
    setShowCreateButton(true);
  };

  const handleCreateClick = async () => {
    setCreating(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/trades`,
        {
          offers: selectedHas,
          wants: selectedWants,
          info: addiInfo,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setCreating(false);
        if (res.data?.success) {
          toast.success(res.data.msg);
          handleCancelClick();
        }
        if (!res.data?.success) toast.error(res.data.msg);
      })
      .catch((err) => {
        setCreating(false);
        const data = err.response?.data;
        if (data?.msg) return toast.error(err.response.data.msg);
        if (typeof data === 'string' && data?.includes('not authenticated'))
          return toast.error('You need to log in first');
        return toast.error(err.message || 'Something went wrong');
      });
  };

  return (
    <div className='w-5/6 flex flex-col justify-center my-8 space-y-5'>
      {offeringOpened && (
        <CreateTradeFormModal
          offers
          selected={selectedHas}
          setSelected={setSelectedHas}
          setOpened={setOfferingOpened}
        />
      )}
      {wantsOpened && (
        <CreateTradeFormModal
          wants
          selected={selectedWants}
          setSelected={setSelectedWants}
          setOpened={setWantsOpened}
        />
      )}
      <div className='bg-lighter-black p-5 rounded-lg'>
        <p className='uppercase'>I'm offering</p>
        <p className='text-right uppercase text-sm'>
          total:{' '}
          <span className='font-rubik text-rose-800 font-extrabold text-shadow-outline ml-2 text-base'>
            {Math.floor(
              selectedHas.reduce((a, skin) => {
                return a + (skin.priceValue || 0);
              }, 0) * 100
            ) / 100}
            $
          </span>
        </p>
        <div className='grid gap-2 my-5 grid-cols-2 presm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {selectedHas.map((item, idx) => {
            return (
              <CreateTradeFormItem
                item={item}
                selected={selectedHas}
                setSelected={setSelectedHas}
                key={idx}
                owned
              />
            );
          })}
          <CreateTradeFormItem selecting handleClick={handleClickOffering} />
        </div>
        <p className='uppercase'>I want</p>
        <p className='text-right uppercase text-sm'>
          total:{' '}
          <span className='font-rubik text-rose-800 font-extrabold text-shadow-outline ml-2 text-base'>
            {Math.floor(
              selectedWants.reduce((a, skin) => {
                return a + (skin.priceValue || 0);
              }, 0) * 100
            ) / 100}
            $
          </span>
        </p>
        <div className='grid gap-2 my-5 grid-cols-2 presm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5 xl:grid-cols-6'>
          {selectedWants.map((item, idx) => {
            return (
              <CreateTradeFormItem
                item={item}
                selected={selectedWants}
                setSelected={setSelectedWants}
                key={idx}
                wanted
              />
            );
          })}
          <CreateTradeFormItem selecting handleClick={handleClickWants} />
        </div>
        <p className='uppercase'>Additional info:</p>
        <div className='mt-5 relative flex w-full min-h-[100px] rounded-md bg-trade-item shadow-lg overflow-x-hidden'>
          <textarea
            type='textarea'
            value={addiInfo}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            className='m-2 flex-1 bg-transparent outline-none flex resize-none'
            placeholder='Explain your trade more into detail...'
            maxLength='250'
          />
        </div>
        <p className='relative text-right mr-2 mb-5 mt-1 text-xs text-gray-400 select-none'>
          Up to 250 characters
        </p>
      </div>

      <div className='flex justify-center space-x-2 md:space-x-8'>
        {!creating && (
          <TradeButton
            handleClick={handleCreateClick}
            text='CREATE'
            color='from-emerald-300 to-emerald-800'
          />
        )}
        {creating && (
          <div className='flex justify-center items-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-4 border-zinc-800 border-t-zinc-600'></div>
          </div>
        )}
        <TradeButton handleClick={handleCancelClick} text='CANCEL' color='from-red-400 to-red-900' />
      </div>
    </div>
  );
};

export default CreateTradeForm;
