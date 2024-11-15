import * as api from '../apis/index.js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as actionTypes from '../constants/actionTypes.js';

// Action creators
export const generateImageByText = createAsyncThunk(actionTypes.GENERATE_BY_TEXT, async (formData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const { data } = await api.generateImageByText(formData);
        return data?.img;
    } catch (error) {
        rejectWithValue(error.message);
    }
});

export const generateImageBySketch = createAsyncThunk(actionTypes.GENERATE_BY_SKETCH, async (formData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const { data } = await api.generateImageBySketch(formData);

        return data?.img;
    } catch (error) {
        rejectWithValue(error.message);
    }
});

