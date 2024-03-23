import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  GlobeAsiaAustraliaIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  LinkIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { FaSteam } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import UserRank from './UserRank';
import UserSocial from './UserSocial';
import TradeDetailItem from './TradeDetailItem';
import Comment from '../../components/Comment/Comment';
import { selectIsUserLoading, selectUser, toggleLoginModal } from '../../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const TradeDetailPage = () => {
  const dispatch = useDispatch();

  const { tradeId } = useParams();

  const user = useSelector(selectUser);
  const isUserLoading = useSelector(selectIsUserLoading);
  const isLoggedIn = Object.keys(user).length > 0;

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [trade, setTrade] = useState(null);

  const [commentValue, setCommentValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const maxLines = 5;
  const handleChange = (e) => {
    const { target } = e;
    const lines = target.value.split('\n').length;
    if (lines >= maxLines) {
      e.preventDefault();
      const newValue = target.value.split('\n').slice(0, maxLines).join('\n');
      setCommentValue(newValue);
      return;
    }
    setCommentValue(target.value);
  };
  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === 'Enter') {
      const lines = commentValue.split('\n').length;
      if (lines >= maxLines) {
        e.preventDefault();
        return;
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUserLoading) return;
    if (!isLoggedIn) {
      dispatch(toggleLoginModal(true));
      return;
    }

    setSubmitting(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/comments`,
        { tradeid: trade.id, content: commentValue },
        { withCredentials: true }
      )
      .then((res) => {
        setSubmitting(false);
        if (res.data?.success) {
          toast.success(res.data.msg);
          setCommentValue('');
          setTrade((prev) => ({
            ...prev,
            comments: [res.data.data, ...prev.comments],
          }));
        }
        if (!res.data?.success) toast.error(res.data.msg);
      })
      .catch((err) => {
        setSubmitting(false);
        const data = err.response?.data;
        if (data?.msg) return toast.error(err.response.data.msg);
        if (typeof data === 'string' && data?.includes('not authenticated'))
          return toast.error('You need to log in first');
        return toast.error(err.message || 'Something went wrong');
      });
  };

  const name =
    trade?.author.username.length > 16
      ? trade?.author.username.slice(0, 13) + '...'
      : trade?.author.username;
  const profit = Math.floor((trade?.totalOffers - trade?.totalWants) * 100) / 100;

  useEffect(() => {
    const fetchTrade = async () => {
      setIsLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/trades/${tradeId}`)
        .then((res) => {
          if (res.data.success) {
            setTrade(res.data.data);
            setIsLoading(false);
            setHasError(false);
          } else {
            setIsLoading(false);
            setHasError(true);
          }
        })
        .catch((err) => {
          setHasError(true);
          const data = err.response?.data;
          if (data?.msg) return toast.error(err.response.data.msg);
          return toast.error(err.message || 'Something went wrong');
        });
    };
    fetchTrade();
  }, [tradeId]);

  if ((hasError || !trade) && !isLoading)
    return (
      <div className='flex h-trade items-center justify-center'>
        <div className='w-5/6 max-w-sm py-16 flex flex-col space-y-4 justify-center items-center bg-lighter-black rounded-2xl shadow-xl'>
          <span>Trade not found</span>
          <Link
            to='/trades'
            className='py-2 px-6 rounded-md bg-trade-item shadow-md transition-all duration-200 hover:bg-trade-item-lighter'>
            Return
          </Link>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className='flex h-trade items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-zinc-800 border-t-zinc-600'></div>
      </div>
    );

  return (
    <div className='py-5 px-3 flex flex-col space-y-5 items-center h-trade overflow-auto overflow-x-hidden'>
      {/* User info */}
      <div className='flex flex-col relative lmg:flex-row w-full max-w-5xl bg-lighter-black shadow-lg rounded-lg p-3'>
        <div className='flex flex-col xs:flex-row'>
          {/* Avatar */}
          <div className='flex justify-center items-center'>
            <img className='rounded-full w-24' src={trade.author.profilePic} alt='' />
          </div>
          {/* User rank & name */}
          <div className='flex flex-col items-center justify-center xs:ml-8'>
            {trade.author.isAdmin && (
              <UserRank
                name={name}
                rank='Admin'
                id={trade.author.id}
                Icon={WrenchScrewdriverIcon}
                color='text-rose-600'
              />
            )}
            {trade.author.isPremium && !trade.author.isAdmin && (
              <UserRank
                name={name}
                rank='Premium'
                id={trade.author.id}
                Icon={StarIcon}
                color='text-amber-400'
              />
            )}
            {!trade.author.isPremium && !trade.author.isAdmin && (
              <UserRank
                name={name}
                rank='Brokie'
                id={trade.author.id}
                Icon={GlobeAsiaAustraliaIcon}
                color='text-slate-400'
              />
            )}
          </div>
        </div>
        {/* Socials */}
        <div
          className={`flex items-center justify-center space-x-3 px-5 lmg:ml-auto whitespace-nowrap flex-wrap`}>
          <UserSocial
            link={`https://steamcommunity.com/profiles/${trade.author.steamid}`}
            title='Steam'
            Icon={FaSteam}
            color={`bg-slate-600 hover:bg-slate-500 lmg:mt-0`}
          />
          <UserSocial
            link={`https://steamrep.com/profiles/${trade.author.steamid}`}
            title='SteamREP'
            Icon={PlusIcon}
            color={`bg-teal-600 hover:bg-teal-500 lmg:mt-0`}
          />
          {trade.author.tradeurl && (
            <UserSocial
              link={trade.author.tradeurl}
              title='Trade with me'
              Icon={LinkIcon}
              color={`bg-emerald-600 hover:bg-emerald-500 lmg:mt-0`}
            />
          )}
        </div>
      </div>
      <div className='flex flex-col w-full max-w-5xl bg-lighter-black shadow-lg rounded-lg p-3'>
        <span className='uppercase'>Is offering:</span>
        <p className='text-right uppercase text-sm'>
          total:{' '}
          <span className='font-rubik text-rose-800 font-extrabold text-shadow-outline ml-2 text-base'>
            {Math.floor(trade.totalOffers * 100) / 100}$
          </span>
        </p>
        <div className='grid md:mx-auto md:w-5/6 gap-2 my-5 grid-cols-2 presm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
          <TradeDetailItem item={trade.offers.highlight} />
          {trade.offers.other.map((item, idx) => (
            <TradeDetailItem key={idx} item={item} />
          ))}
        </div>
        <span className='uppercase'>Wants:</span>
        <p className='text-right uppercase text-sm'>
          total:{' '}
          <span className='font-rubik text-rose-800 font-extrabold text-shadow-outline ml-2 text-base'>
            {Math.floor(trade.totalWants * 100) / 100}$
          </span>
        </p>
        <div className='grid md:mx-auto md:w-5/6 gap-2 my-5 grid-cols-2 presm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
          <TradeDetailItem item={trade.wants.highlight} isWanted />
          {trade.wants.other.map((item, idx) => (
            <TradeDetailItem key={idx} item={item} isWanted />
          ))}
        </div>
        <div className='my-5 ml-auto uppercase font-rubik pr-4 pl-14 pt-2 border-t border-zinc-600 border-solid'>
          <span>diff </span>
          <span
            style={{
              color: profit > 0 ? 'green' : profit < 0 ? 'crimson' : 'gray',
            }}
            className='ml-4'>
            {profit}$
          </span>
        </div>
        {trade.info && <span className='uppercase'>Additional info:</span>}
        {trade.info && (
          <div className='mt-3 rounded-md bg-trade-item p-3 italic'>
            "
            {trade.info.split('\n').map((line, idx) => {
              return (
                <span key={idx}>
                  {line}
                  {idx < trade.info.split('\n').length - 1 && <br />}
                </span>
              );
            })}
            "
          </div>
        )}
      </div>
      <div className='flex flex-col p-3 rounded-lg bg-lighter-black w-full max-w-5xl shadow-lg'>
        <span className='uppercase'>comments</span>
        <div className='flex flex-col mt-2 pb-6 border-b border-solid border-zinc-600 '>
          <textarea
            type='textarea'
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            className='text-sm sm:text-md flex bg-trade-item p-2 h-20 rounded-md outline-none resize-none placeholder-zinc-400'
            placeholder='Leave a comment...'
            value={commentValue}
            maxLength='250'
          />
          <button
            className='flex justify-center items-center ml-auto mr-6 px-7 py-2 mt-2 rounded-sm shadow-md transition-all duration-300 bg-cyan-600 hover:bg-cyan-500'
            onClick={handleSubmit}>
            {(isUserLoading || submitting) && (
              <div className='animate-spin rounded-full h-5 w-5 border-2 border-zinc-200 border-t-zinc-500'></div>
            )}
            {!isUserLoading && !submitting && <PaperAirplaneIcon className='h-5' />}
          </button>
        </div>

        {isLoading &&
          new Array(3)
            .fill(null)
            .map((comment, idx) => <Comment key={idx} comment={comment} isLoading />)}
        {hasError && (
          <div className='p-2 flex justify-center'>
            <span>Failed to fetch comments</span>
          </div>
        )}
        {trade.comments?.length > 0 &&
          !isLoading &&
          !hasError &&
          trade.comments.map((comment, idx) => <Comment comment={comment} key={idx} />)}
      </div>
    </div>
  );
};

export default TradeDetailPage;
