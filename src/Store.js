import { configureStore } from '@reduxjs/toolkit';
import cryptoSlice from './Slice/cryptoSlice';

const store = configureStore({
    reducer: {
        crypto: cryptoSlice,
    },
});

export default store;
