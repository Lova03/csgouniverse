import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchTrades = createAsyncThunk('items/fetchTrades', async ({ query, page, ct }) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/trades?${query ? `q=${query}&` : ''}l=${page}`
    );
    if (response.ok) {
      const jsonResponse = await response.json();
      return { ...jsonResponse, ct };
    }
    throw new Error('Request to API failed!');
  } catch (err) {
    return 'failed';
  }
});
const tradesSlice = createSlice({
  name: 'trades',
  initialState: {
    trades: { success: true, data: [] },
    showDetailHover: true,
    showDetailClick: false,
    hasError: false,
    isLoading: false,
    moreToLoad: true,
    searchTerm: '',
  },
  reducers: {
    changeSearchTerm: (state, action) => {
      state.searchTerm = action.payload.toLowerCase();
    },
    changeShowDetailHover: (state, action) => {
      state.showDetailClick = false;
      state.showDetailHover = action.payload;
    },
    changeShowDetailClick: (state, action) => {
      state.showDetailClick = action.payload;
      state.showDetailHover = false;
    },
    changeMoreToLoad: (state, action) => {
      state.moreToLoad = action.payload;
    },
  },
  extraReducers: {
    [fetchTrades.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchTrades.fulfilled]: (state, action) => {
      const { success, data, ct } = action.payload;
      if (success && ct) {
        if (
          state.trades.data[state.trades.data?.length - 1]?.id !== data[data.length - 1]?.id &&
          data.length > 0
        ) {
          data.forEach(
            (trade) =>
              state.trades.data.findIndex((x) => x.id === trade.id) === -1 &&
              state.trades.data.push(trade)
          );
          state.trades.success = success;
        } else {
          state.moreToLoad = false;
        }
      }
      if (success && !ct) {
        state.trades = { data, success };
        state.moreToLoad = true;
      }
      state.isLoading = false;
      state.hasError = false;
      if (action.payload === 'failed') state.hasError = true;
      if (!success) state.hasError = true;
    },
    [fetchTrades.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  },
});

export const selectTrades = (state) => state.trades.trades.data || [];
export const selectHasError = (state) => state.trades.hasError;
export const selectIsLoading = (state) => state.trades.isLoading;
export const selectSearchTerm = (state) => state.trades.searchTerm;
export const selectShowDetailHover = (state) => state.trades.showDetailHover;
export const selectShowDetailClick = (state) => state.trades.showDetailClick;
export const selectMoreToLoadTrades = (state) => state.trades.moreToLoad;
export const selectFilteredTrades = (state) => {
  return state.trades.trades.data.filter(
    (trade) =>
      trade.offers.highlight.market_hash_name
        .toLowerCase()
        .split(' ')
        .some(
          (x) => state.trades.searchTerm.split(' ').includes(x) || x.includes(state.trades.searchTerm)
        ) ||
      trade.wants.highlight.market_hash_name
        .toLowerCase()
        .split(' ')
        .some(
          (x) => state.trades.searchTerm.split(' ').includes(x) || x.includes(state.trades.searchTerm)
        ) ||
      trade.offers.other.some((item) =>
        item.market_hash_name
          .toLowerCase()
          .split(' ')
          .some(
            (x) => state.trades.searchTerm.split(' ').includes(x) || x.includes(state.trades.searchTerm)
          )
      ) ||
      trade.wants.other.some((item) =>
        item.market_hash_name
          .toLowerCase()
          .split(' ')
          .some(
            (x) => state.trades.searchTerm.split(' ').includes(x) || x.includes(state.trades.searchTerm)
          )
      )
  );
};

export const { changeSearchTerm, changeShowDetailHover, changeShowDetailClick, changeMoreToLoad } =
  tradesSlice.actions;

export default tradesSlice.reducer;
