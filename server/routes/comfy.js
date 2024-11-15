import express from 'express';
import ComfyUIController from '../controllers/comfy.js';
import { generateImage } from '../controllers/test.js';
const router = express.Router();

const comfyClient = new ComfyUIController();

router.use('/generate/text', comfyClient.generateImageByText.bind(comfyClient));
router.use('/generate/sketch', comfyClient.generateImageBySketch.bind(comfyClient));

export default router;