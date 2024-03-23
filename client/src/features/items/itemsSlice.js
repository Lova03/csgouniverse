import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchItems = createAsyncThunk('items/fetchItems', async ({ query, page, ct }) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/items?${query ? `q=${query}&` : ''}l=${page}`
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

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    listNum: 1,
    searchTerm: '',
    items: {},
    filteredItems: [],
    hasError: false,
    isLoading: false,
    moreToLoad: true,
  },
  reducers: {
    changeListNum: (state, action) => {
      state.listNum = action.payload;
    },
    changeItemsSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    changeMoreToLoad: (state, action) => {
      state.moreToLoad = action.payload;
    },
  },
  extraReducers: {
    [fetchItems.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchItems.fulfilled]: (state, action) => {
      const { success, data, ct } = action.payload;
      if (success && ct) {
        if (
          state.items.data[state.items.data?.length - 1]?._id !== data[data.length - 1]?._id &&
          data.length > 0
        ) {
          state.items.data = [...state.items.data, ...data];
          state.items.success = success;
        } else {
          state.moreToLoad = false;
        }
      }
      if (success && !ct) {
        state.items = { data, success };
        state.moreToLoad = true;
      }
      state.isLoading = false;
      state.hasError = false;
      if (action.payload === 'failed') state.hasError = true;
      if (!success) state.hasError = true;
    },
    [fetchItems.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  },
});

export const selectItems = (state) => state.items.items;
export const selectMoreToLoad = (state) => state.items.moreToLoad;
export const selectItemsSearchTerm = (state) => state.items.searchTerm;
export const selectListNum = (state) => state.items.listNum;
export const selectItemsHasError = (state) => state.items.hasError;
export const selectItemsIsLoading = (state) => state.items.isLoading;
export const selectFilteredItems = (state) => {
  return state.items.filteredItems.filter((item) =>
    item.market_hash_name
      .toLowerCase()
      .split(' ')
      .some((x) => state.items.searchTerm.split(' ').includes(x) || x.includes(state.items.searchTerm))
  );
};

export const { changeListNum, changeItemsSearchTerm } = itemsSlice.actions;

export default itemsSlice.reducer;
