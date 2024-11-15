import WebSocket from 'ws';
import axios from 'axios';
import { v4 } from 'uuid';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import workflow from '../workflows/test.js';

const serverAddress = '127.0.0.1:8188';
const clientId = v4();

async function queuePrompt(prompt) {
    const response = await axios.post(`http://${serverAddress}/prompt`, {
        prompt: prompt,
        client_id: clientId
    });
    return response.data;
}

async function getImage(filename, subfolder, folderType) {
    const params = new URLSearchParams({
        filename: filename,
        subfolder: subfolder,
        type: folderType
    });

    const response = await axios.get(`http://${serverAddress}/view?${params.toString()}`, {
        responseType: 'arraybuffer'
    });

    return response.data;
}

async function getHistory(promptId) {
    const response = await axios.get(`http://${serverAddress}/history/${promptId}`);
    return response.data;
}

async function getImages(ws, prompt) {
    const queueResponse = await queuePrompt(prompt);
    const promptId = queueResponse.prompt_id;
    const outputImages = {};

    return new Promise((resolve, reject) => {
        ws.on('message', async (data) => {
            let message;
            try {
                message = JSON.parse(data);
            } catch (e) {
                // If binary data is received (previews), you can handle it here if needed
                return;
            }

            if (message.type === 'executing') {
                const execData = message.data;
                if (execData.node === null && execData.prompt_id === promptId) {
                    // Execution is done, proceed to get images
                    try {
                        const history = (await getHistory(promptId))[promptId];
                        for (const nodeId in history.outputs) {
                            const nodeOutput = history.outputs[nodeId];
                            const imagesOutput = [];

                            if (nodeOutput.images) {
                                for (const image of nodeOutput.images) {
                                    const imageData = await getImage(
                                        image.filename,
                                        image.subfolder,
                                        image.type
                                    );
                                    imagesOutput.push(imageData);
                                }
                            }
                            outputImages[nodeId] = imagesOutput;
                        }
                        resolve(outputImages);
                    } catch (error) {
                        reject(error);
                    } finally {
                        ws.close(); // Ensure the WebSocket is closed after processing
                    }
                }
            }
        });

        ws.on('error', (err) => {
            reject(err);
        });
    });
}

async function setInputPrompt(prompt) {
    const { positive, negative, steps, size } = prompt;

    workflow["1"]["inputs"]["seed"] = Math.floor(Math.random() * 1000000000001);
    workflow["1"]["inputs"]["steps"] = steps;

    // checkpoint
    // workflow["2"]["inputs"]["ckpt_name"] = steps;

    workflow["3"]["inputs"]["text"] = positive;
    workflow["4"]["inputs"]["text"] += `,${negative}`;

    workflow["8"]["inputs"]["width"] = size.width;
    workflow["8"]["inputs"]["height"] = size.height;
}

export const generateImage = async (req, res) => {

    const prompt = req.body;
    const ws = new WebSocket(`ws://${serverAddress}/ws?clientId=${clientId}`);

    ws.on('open', async () => {
        try {
            setInputPrompt(prompt);

            const images = await getImages(ws, workflow);
            console.log(Object.values(images));

            const buffer = Object.values(images)[0][0];

            const base64Image = buffer.toString('base64');

            const base64ImageURL = `data:image/png;base64,${base64Image}`;

            res.status(200).json({ img: base64ImageURL });
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(404).json({ message: error.message });
        }
    });
}
