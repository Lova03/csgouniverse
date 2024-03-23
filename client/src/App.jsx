import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchItems } from './features/items/itemsSlice';
import { fetchUser } from './features/user/userSlice';
import HomePage from './pages/HomePage/HomePage';
import Other from './pages/Other/Other';

function App() {
  const [opened, setOpened] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchItems({ query: '', page: 1 }));
  }, [dispatch]);

  return (
    <Router>
      <div className='min-h-screen bg-zinc-900 text-slate-200 flex flex-col font-main'>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='*' element={<Other setOpened={setOpened} opened={opened} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
