import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:3002' });

export const generateImageByText = (formData) => API.post(`/comfy/generate/text`, formData);
export const generateImageBySketch = (formData) => API.post(`/comfy/generate/sketch`, formData);