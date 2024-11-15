export default {
    "1": {
        "inputs": {
            "seed": 497122952544461,
            "steps": 25,
            "cfg": 8,
            "sampler_name": "euler_ancestral",
            "scheduler": "normal",
            "denoise": 1,
            "model": [
                "142",
                0
            ],
            "positive": [
                "3",
                0
            ],
            "negative": [
                "4",
                0
            ],
            "latent_image": [
                "8",
                0
            ]
        },
        "class_type": "KSampler",
        "_meta": {
            "title": "KSampler"
        }
    },
    "2": {
        "inputs": {
            "ckpt_name": "realisticV51_realisticV51.safetensors"
        },
        "class_type": "CheckpointLoaderSimple",
        "_meta": {
            "title": "Load Checkpoint"
        }
    },
    "3": {
        "inputs": {
            "text": "cozy farmhouse living room, exposed wooden beams, stone fireplace, rustic wooden furniture, warm lighting, soft natural colors, detailed textures, high resolution",
            "clip": [
                "142",
                1
            ]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
            "title": "CLIP Text Encode (Prompt)"
        }
    },
    "4": {
        "inputs": {
            "text": "blurry, low resolution, out of focus, low quality, grainy, low-poly, cartoonish, unrealistic proportions, exaggerated lighting, distorted, overexposed, underexposed, cluttered, chaotic, extra objects, irrelevant objects, text, logo, watermark, overly bright, neon colors, low contrast, poorly detailed, bad perspective, over-saturated colors, extra limbs, duplicate objects, crowded, unbalanced composition",
            "clip": [
                "142",
                1
            ]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
            "title": "CLIP Text Encode (Prompt)"
        }
    },
    "5": {
        "inputs": {
            "samples": [
                "1",
                0
            ],
            "vae": [
                "6",
                0
            ]
        },
        "class_type": "VAEDecode",
        "_meta": {
            "title": "VAE Decode"
        }
    },
    "6": {
        "inputs": {
            "vae_name": "vaeFtMse840000Ema.ye6i.safetensors"
        },
        "class_type": "VAELoader",
        "_meta": {
            "title": "Load VAE"
        }
    },
    "7": {
        "inputs": {
            "filename_prefix": "ComfyUI",
            "images": [
                "5",
                0
            ]
        },
        "class_type": "SaveImage",
        "_meta": {
            "title": "Save Image"
        }
    },
    "8": {
        "inputs": {
            "width": 512,
            "height": 512,
            "batch_size": 1
        },
        "class_type": "EmptyLatentImage",
        "_meta": {
            "title": "Empty Latent Image"
        }
    },
    "142": {
        "inputs": {
            "lora_name": "furniture_v10.safetensors",
            "strength_model": 0.5,
            "strength_clip": 0.5,
            "model": [
                "2",
                0
            ],
            "clip": [
                "2",
                1
            ]
        },
        "class_type": "LoraLoader",
        "_meta": {
            "title": "Load LoRA"
        }
    }
}