import WebSocket from 'ws';
import fs from 'fs';
import FormData from 'form-data';
import seedrandom from 'seedrandom';

import * as comfyApi from '../apis/comfyEndpointApi.js';

const COMFY_UI_PORT = process.env.COMFY_UI_PORT || 8188;
const COMFY_UI_ADDRESS = process.env.COMFY_UI_ADDRESS || 'localhost';

class ComfyUIController {
    constructor() {
        this.workflow = {
            text2image: (JSON.parse(fs.readFileSync('./workflows/workflow_api_text2image.json', 'utf8'))),
            sketch2image: (JSON.parse(fs.readFileSync('./workflows/workflow_api_sketch2image.json', 'utf8'))),
        };
    }

    async connect() {
        this.ws = new WebSocket(`ws://${COMFY_UI_ADDRESS}:${COMFY_UI_PORT}/ws`);
        this.ws.on('open', async () => {
            try {
                console.log(`Open WebSocket to ComfyUI on: http://${COMFY_UI_ADDRESS}:${COMFY_UI_PORT}`);
            } catch (error) {
                console.error(error);
                res.status(404).json({ message: error.message });
            }
        });

        this.ws.on('close', async () => {
            try {
                console.log(`Close ComfyUI socket`);
            } catch (error) {
                console.error(error);
                res.status(404).json({ message: error.message });
            }
        });

    }

    async destroy() {
        this.ws.close();
        this.workflow = null;
    }

    arrayBufferToBase64(buffer) {
        const base64Image = buffer.toString('base64');
        const base64ImageURL = `data:image/png;base64,${base64Image}`;
        return base64ImageURL;
    }

    async generateImageByText(req, res) {
        const inputs = req.body;
        try {
            await this.connect();
            const prompt = await this.promptImageByText(this.workflow.text2image, inputs);
            const { data: { prompt_id } } = await comfyApi.getQueuePrompt(prompt);
            await this.trackProgress(prompt, prompt_id);
            const history = await this.getHistory(prompt_id);
            const images = await this.getImages(history);
            return res.status(200).json({ img: Object.values(images)[0][0] });
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }

    async promptImageByText(prompt, inputs) {
        try {
            const { positive, negative, size } = inputs;
            const text2imagePromt = { ...prompt };
            Object.entries(text2imagePromt).forEach(([key, value]) => {
                if (value.class_type === 'KSampler') {
                    const seed = Math.floor(Math.random() * 9e14) + 1e14;
                    text2imagePromt[key]['inputs']['seed'] = seed;
                }
                if (value.class_type === 'EmptyLatentImage') {
                    text2imagePromt[key]['inputs']['width'] = size?.width ?? 512;
                    text2imagePromt[key]['inputs']['height'] = size?.height ?? 512;
                }
                if (value.class_type === 'CLIPTextEncode') {
                    if (value?._meta?.title === 'CLIP Text Encode (Positive)') {
                        text2imagePromt[key]['inputs']['text'] += ', ' + positive;
                    }
                    else {
                        text2imagePromt[key]['inputs']['text'] += ', ' + negative;
                    }
                }
            })
            return text2imagePromt;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async generateImageBySketch(req, res) {
        const inputs = req.body;
        try {
            await this.connect();
            const buffer = Buffer.from(String(inputs.image.image).split(',')[1], 'base64');
            const result = await this.uploadImage(buffer, inputs.image.name);
            const prompt = await this.promptImageBySketch(this.workflow.sketch2image, inputs);
            const { data: { prompt_id } } = await comfyApi.getQueuePrompt(prompt);
            await this.trackProgress(prompt, prompt_id);
            const history = await this.getHistory(prompt_id);
            const images = await this.getImages(history);
            return res.status(200).json({ img: Object.values(images)[0][0] });
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }

    async promptImageBySketch(prompt, inputs) {
        try {
            const { positive, negative, size, image } = inputs;
            const text2imagePromt = { ...prompt };
            Object.entries(text2imagePromt).forEach(([key, value]) => {
                if (value.class_type === 'KSampler') {
                    const seed = Math.floor(Math.random() * 9e14) + 1e14;
                    text2imagePromt[key]['inputs']['seed'] = seed;
                }
                if (value.class_type === 'EmptyLatentImage') {
                    text2imagePromt[key]['inputs']['width'] = size?.width ?? 512;
                    text2imagePromt[key]['inputs']['height'] = size?.height ?? 512;
                }
                if (value.class_type === 'CLIPTextEncode') {
                    if (value?._meta?.title === 'CLIP Text Encode (Positive)') {
                        text2imagePromt[key]['inputs']['text'] += ', ' + positive;
                    }
                    else {
                        text2imagePromt[key]['inputs']['text'] += ', ' + negative;
                    }
                }
                if (value.class_type === 'LoadImage') {
                    text2imagePromt[key]['inputs']['image'] = image.name;
                }
            })
            return text2imagePromt;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getQueuePrompt(prompt) {
        try {
            const { data } = await comfyApi.getQueuePrompt(prompt);
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getHistory(prompt_id) {
        try {
            const { data } = await comfyApi.getHistory(prompt_id);
            return data[prompt_id];
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getImage(filename, subfolder, type) {
        try {
            const params = new URLSearchParams({
                filename: filename,
                subfolder: subfolder,
                type: type
            });
            const { data } = await comfyApi.getView(params.toString())
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getImages(history) {
        const output = {};

        try {
            for (const nodeId in history.outputs) {
                const nodeOutput = history.outputs[nodeId];
                if (nodeOutput.images) {
                    const arr = [];
                    for (const image of nodeOutput.images) {
                        const imageData = await this.getImage(
                            image.filename,
                            image.subfolder,
                            image.type
                        );
                        arr.push(this.arrayBufferToBase64(imageData));
                    }
                    output[nodeId] = arr;
                }
            }
            return output;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async uploadImage(buffer, filename, imageType = "input", overwrite = false) {
        const formData = new FormData();
        // formData.append('image', fs.createReadStream("C:/Users/nguye/OneDrive/Máy tính/redis-cache.png"),
        //     { filename: 'redis-cache', contentType: 'image/png' });
        formData.append('image', buffer,
            { filename: filename, contentType: 'image/png' });
        formData.append('type', 'input');
        formData.append('overwrite', overwrite.toString().toLowerCase());

        try {
            const { data } = await comfyApi.uploadImage(formData);
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async trackProgress(prompt, promptId) {
        this.isLoading = 0;

        // Xóa sự kiện message nếu đã tồn tại để tránh đăng ký nhiều lần
        if (this.messageHandler) {
            this.ws.off('message', this.messageHandler);
        }

        // Định nghĩa và gán messageHandler mới
        return new Promise((resolve, reject) => {
            this.messageHandler = (message) => {
                try {
                    const out = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : JSON.parse(message);

                    if (out.type === 'progress') {
                        const data = out.data;
                        const currentStep = data.value;
                        console.log(`In K - Sampler -> Step: ${currentStep} of: ${data.max}`);
                        if (currentStep === data.max) {
                            this.isLoading = 1;
                        }
                    }

                    if (out.type === 'status') {
                        const { queue_remaining } = out.data.status.exec_info;

                        if (queue_remaining === 0 && this.isLoading === 1) {
                            console.log('Completed');
                            resolve('success');  // Gọi resolve khi hoàn tất
                            this.ws.off('message', this.messageHandler);  // Gỡ sự kiện sau khi hoàn thành
                        }
                    }
                } catch (error) {
                    reject(error);  // Gọi reject nếu có lỗi
                }
            };

            this.ws.on('message', this.messageHandler);  // Đăng ký messageHandler
        });
    }


}

export default ComfyUIController;