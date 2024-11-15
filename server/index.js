import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import comfyRoutes from './routes/comfy.js';
import ComfyUIController from './controllers/comfy.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use('/comfy', comfyRoutes);

const PORT = process.env.PORT || 3002;
const COMFY_UI_PORT = process.env.COMFY_UI_PORT || 8188;
const SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'localhost';
const COMFY_UI_ADDRESS = process.env.COMFY_UI_ADDRESS || 'localhost';

app.listen(PORT, () => console.log(`Server running on: http://${SERVER_ADDRESS}:${PORT}`));