import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header/Header';
import LoginModal from '../../components/LoginModal/LoginModal';
import Navbar from '../../components/Navbar/Navbar';
import Panel from '../../components/Panel/Panel';
import { selectIsUserLoading, selectShowLoginModal, selectUser } from '../../features/user/userSlice';
import TradeDetailPage from '../TradeDetailPage/TradeDetailPage';
import TradesPage from '../TradesPage/TradesPage';
import UsersPage from '../UsersPage/UsersPage';

const Other = ({ opened, setOpened }) => {
  const loginModalOpened = useSelector(selectShowLoginModal);
  const loggingIn = useSelector(selectIsUserLoading);
  const user = useSelector(selectUser);
  const isLoggedIn = Object.keys(user).length > 0;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`opacity-0 transition-opacity duration-300${loaded && ' opacity-100'}`}>
      <Header />
      <div>
        <Navbar opened={opened} setOpened={setOpened} />
        <main
          className={`h-trade transition-all duration-100 ${
            opened ? 'ml-8 sm:ml-12 lg:ml-64' : 'ml-8 sm:ml-12'
          }`}>
          <Panel />
          <Routes>
            <Route path='/trades' element={<TradesPage />} />
            <Route path='/trades/:tradeId' element={<TradeDetailPage />} />
            <Route path='/users/:userId' element={<UsersPage />} />
            <Route path='/profile' element={<TradesPage />} />
            <Route path='/history' element={<TradesPage />} />
            <Route path='/favorites' element={<TradesPage />} />
            <Route path='/premium' element={<TradesPage />} />
            <Route path='/donators' element={<TradesPage />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </main>
        {loginModalOpened && !isLoggedIn && !loggingIn && <LoginModal />}
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme='colored'
        />
      </div>
    </div>
  );
};

export default Other;
