import { animated, useSpring } from '@react-spring/web';
import ReactTimeAgo from 'react-time-ago';
import { Link } from 'react-router-dom';

const Comment = ({ isLoading, comment }) => {
  const avatarProps = useSpring({
    from: {
      left: '-150%',
    },
    to: {
      left: '100%',
    },
    loop: true,
    delay: 2 * 1000,
    config: {
      duration: 1 * 1000,
    },
  });
  const nameProps = useSpring({
    from: {
      left: '-100%',
    },
    to: {
      left: '100%',
    },
    loop: true,
    delay: 2 * 1000,
    config: {
      duration: 1.5 * 1000,
    },
  });
  const contentProps = useSpring({
    from: {
      left: '-100%',
    },
    to: {
      left: '100%',
    },
    loop: true,
    delay: 2 * 1000,
    config: {
      duration: 2 * 1000,
    },
  });

  // Skeleton
  if (isLoading)
    return (
      <div className='p-2 my-2 rounded-md flex flex-col space-y-1'>
        {/* Author Info */}
        <div className='flex space-x-2 items-center'>
          {/* Avatar */}
          <div className='rounded-full w-8 h-8 bg-zinc-600 relative overflow-hidden'>
            <animated.div
              style={{
                ...avatarProps,
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
                minWidth: '3rem',
                background: 'linear-gradient(to right, transparent, #FFFFFF30, #FFFFFF30, transparent)',
              }}></animated.div>
          </div>
          {/* Author Name */}
          <div className='rounded-xl w-44 h-6 bg-zinc-600 relative overflow-hidden'>
            <animated.div
              style={{
                ...nameProps,
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '50%',
                minWidth: '3rem',
                background: 'linear-gradient(to right, transparent, #FFFFFF30, #FFFFFF30, transparent)',
              }}></animated.div>
          </div>
        </div>
        {/* Content */}
        <div className='w-full h-12 rounded-md bg-zinc-600 relative overflow-hidden'>
          <animated.div
            style={{
              ...contentProps,
              position: 'absolute',
              top: 0,
              height: '100%',
              width: '100%',
              minWidth: '3rem',
              background: 'linear-gradient(to right, transparent, #FFFFFF30, #FFFFFF30, transparent)',
            }}></animated.div>
        </div>
      </div>
    );

  return (
    <div className='p-2 my-2 rounded-md flex flex-col space-y-3'>
      {/* Author Info */}
      <div className='flex justify-between items-end'>
        <div className='flex space-x-3 items-center'>
          {/* Avatar */}
          <div className='rounded-full w-8 h-8 bg-zinc-600/20 relative overflow-hidden'>
            <img src={comment.authorPic} alt='' />
          </div>
          {/* Author Name */}
          <Link to={`/users/${comment.authorId}`} className='relative font-semibold'>
            {comment.authorIsAdmin && <span className='text-rose-600'>{comment.authorName}</span>}
            {comment.authorIsPremium && !comment.authorIsPremium && (
              <span className='text-amber-400'>{comment.authorName}</span>
            )}
            {!comment.authorIsAdmin && !comment.authorIsPremium && (
              <span className='text-slate-400'>{comment.authorName}</span>
            )}
          </Link>
        </div>

        <div className='text-xs mr-5'>
          <ReactTimeAgo date={comment.date} />
        </div>
      </div>
      {/* Content */}
      <div className='w-full px-3 py-3 rounded-md bg-trade-item-lighter/70 relative overflow-hidden'>
        {comment.content.split('\n').map((line, idx) => {
          return (
            <span key={idx}>
              {line}
              {idx < comment.content.split('\n').length - 1 && <br />}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Comment;
