import { useParams } from 'react-router-dom';

const TradingPage = () => {
  const { userId } = useParams();

  return <div className='flex h-trade items-center justify-center'>{userId}</div>;
};

export default TradingPage;
