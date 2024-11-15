import axios from "axios";

const COMFY_UI_PORT = process.env.COMFY_UI_PORT || 8188;
const COMFY_UI_ADDRESS = process.env.COMFY_UI_ADDRESS || 'localhost';


const API = axios.create({ baseURL: `http://${COMFY_UI_ADDRESS}:${COMFY_UI_PORT}` })

export const getQueuePrompt = (prompt) => API.post(`/prompt`, { prompt: prompt });
export const getHistory = (prompt_id) => API.get(`/history/${prompt_id}`);
export const getView = (queryParams) => API.get(`/view?${queryParams}`, { responseType: 'arraybuffer' });
export const uploadImage = (formData) => API.post(`/upload/image`, formData);
// export const getQueuePrompt = (prompt) => API.post(`/prompt`, { prompt: prompt });


