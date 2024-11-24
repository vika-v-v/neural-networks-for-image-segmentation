# model_handler.py
from transformers import SegformerImageProcessor, AutoModelForSemanticSegmentation
from PIL import Image
import requests
import numpy as np
import io
import base64
import torch.nn.functional as F
from flask import Flask, request, jsonify

class SegformerClothesModel:
    def __init__(self, model_name):
        self.processor = SegformerImageProcessor.from_pretrained(model_name)
        self.model = AutoModelForSemanticSegmentation.from_pretrained(model_name)
        self.label_descriptions = {
            0: "Background",
            1: "Hat",
            2: "Hair",
            3: "Sunglasses",
            4: "Upper-clothes",
            5: "Skirt",
            6: "Pants",
            7: "Dress",
            8: "Belt",
            9: "Left-shoe",
            10: "Right-shoe",
            11: "Face",
            12: "Left-leg",
            13: "Right-leg",
            14: "Left-arm",
            15: "Right-arm",
            16: "Bag",
            17: "Scarf"
        }

    def rgb_to_hex(self, rgb):
        return f'#{int(rgb[0]):02x}{int(rgb[1]):02x}{int(rgb[2]):02x}'

    def segment_image(self, url):
        if not url:
            print("no image data")
            return
        elif url.startswith('http'):
            # It's a URL
            response = requests.get(url, stream=True)
            if response.status_code != 200:
                raise ValueError('Failed to fetch image from URL')
            image = Image.open(response.raw).convert("RGB")
        else:
            # Assume it's base64 encoded image data
            try:
                # If the data starts with 'data:image/...;base64,', strip it
                if 'base64,' in url:
                    url = url.split('base64,')[1]

                image_bytes = base64.b64decode(url)
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            except Exception as e:
                raise ValueError('Failed to decode base64 image data') from e

        # Process the image as before
        inputs = self.processor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)
        logits = outputs.logits.cpu()
        upsampled_logits = F.interpolate(logits, size=image.size[::-1], mode="bilinear", align_corners=False)
        pred_seg = upsampled_logits.argmax(dim=1)[0]
        
        segments = []
        unique_labels = np.unique(pred_seg.numpy())

        for label in unique_labels:
            score = (pred_seg == label).numpy()
            score = score.astype(int).sum() / score.size
            score = round(score, 4)

            mask = (pred_seg == label).numpy()
            color = np.random.randint(0, 255, 3)
            hexColor = self.rgb_to_hex(color)
            rgba_color = np.append(color, [128])  # 50% transparency
            colored_mask_image = np.zeros((*mask.shape, 4), dtype=np.uint8)
            colored_mask_image[mask] = rgba_color
            mask_pil = Image.fromarray(colored_mask_image, mode="RGBA")
            buffered = io.BytesIO()
            mask_pil.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            segments.append({
                'label': self.label_descriptions.get(label, "Unknown"),  # Use the label description
                'color': hexColor,
                'score': score,
                'base64': img_base64
            })

        return segments
