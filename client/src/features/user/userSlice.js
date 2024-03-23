import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserItems = createAsyncThunk('user/fetchUserItems', async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/inventory`, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });
    if (response.status === 200) {
      return { ...response.data };
    }

    throw new Error('Request to API failed!');
  } catch (err) {
    console.log(err);
  }
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (args, { dispatch }) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}auth`, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });

    if (response.status === 200 && response.data.success) {
      dispatch(fetchUserItems());
      return { ...response.data };
    }

    throw new Error('Request to API failed!');
  } catch (err) {
    console.log(err);
  }
  return {};
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    inventory: { success: false },
    isLoading: false,
    hasError: false,
    isILoading: false,
    hasIError: false,
    showLoginModal: true,
  },
  reducers: {
    logoutUser: (state, action) => {
      state.user = {};
    },
    toggleLoginModal: (state, action) => {
      state.showLoginModal = action.payload;
    },
  },
  extraReducers: {
    [fetchUser.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [fetchUserItems.pending]: (state, action) => {
      state.isILoading = true;
      state.hasIError = false;
    },
    [fetchUserItems.fulfilled]: (state, action) => {
      state.inventory = action.payload?.items
        ? { success: true, ...action.payload }
        : { success: false };
      state.isILoading = false;
      state.hasIError = !action.payload?.items ? true : false;
    },
    [fetchUserItems.rejected]: (state, action) => {
      state.isILoading = false;
      state.hasIError = true;
    },
  },
});

export const selectUser = (state) => state.user.user;
export const selectUserItems = (state) => state.user.inventory;
export const selectIsItemsLoading = (state) => state.user.isILoading;
export const selectHasItemsError = (state) => state.user.hasIError;
export const selectShowLoginModal = (state) => state.user.showLoginModal;
export const selectIsUserLoading = (state) => state.user.isLoading;
export const selectHasUserError = (state) => state.user.hasError;

export const { logoutUser, toggleLoginModal } = userSlice.actions;

export default userSlice.reducer;
