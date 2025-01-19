import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

export const fetchCryptoData = createAsyncThunk('crypto/fetchCryptoData', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

const cryptoSlice = createSlice({
    name: 'crypto',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCryptoData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCryptoData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchCryptoData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default cryptoSlice.reducer;
