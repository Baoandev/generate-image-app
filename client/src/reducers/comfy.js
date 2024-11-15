import { createSlice } from '@reduxjs/toolkit';
import * as actionTypes from '../constants/actionTypes.js';

const initialState = {
    image: '',
    isLoading: undefined,
}

const comfySlice = createSlice({
    name: 'comfy',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(`${'NO_LOGIN'}`, () => { return { ...initialState, isLoading: false }; })
            .addCase(`${actionTypes.RESET_IMAGE}`, () => { return { ...initialState, isLoading: false }; })
            .addCase(`${actionTypes.GENERATE_BY_TEXT}/fulfilled`, (state, action) => {
                return {
                    ...state,
                    image: action.payload
                }
            })
            .addCase(`${actionTypes.GENERATE_BY_SKETCH}/fulfilled`, (state, action) => {
                return {
                    ...state,
                    image: action.payload
                }
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    return {
                        image: '',
                        isLoading: true
                    };
                }

            );
    },
});

export default comfySlice.reducer;