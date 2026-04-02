# mask2former_ade_handler.py
from transformers import Mask2FormerImageProcessor, Mask2FormerForUniversalSegmentation
from PIL import Image
import requests
import numpy as np
import io
import base64
import torch


class Mask2FormerADEModel:
    def __init__(self, model_name):
        self.processor = Mask2FormerImageProcessor.from_pretrained(model_name)
        self.model = Mask2FormerForUniversalSegmentation.from_pretrained(model_name)
        self.model.eval()
        self.id2label = self.model.config.id2label

    def rgb_to_hex(self, rgb):
        return f'#{int(rgb[0]):02x}{int(rgb[1]):02x}{int(rgb[2]):02x}'

    def segment_image(self, url):
        if not url:
            print("no image data")
            return

        if url.startswith('http'):
            response = requests.get(url, stream=True)
            if response.status_code != 200:
                raise ValueError('Failed to fetch image from URL')
            image = Image.open(response.raw).convert("RGB")
        else:
            try:
                if 'base64,' in url:
                    url = url.split('base64,')[1]
                image_bytes = base64.b64decode(url)
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            except Exception as e:
                raise ValueError('Failed to decode base64 image data') from e

        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)

        pred_seg = self.processor.post_process_semantic_segmentation(
            outputs, target_sizes=[image.size[::-1]]
        )[0]

        segments = []
        unique_labels = np.unique(pred_seg.numpy())

        for label in unique_labels:
            label = int(label)
            mask = (pred_seg == label).numpy()

            score = mask.astype(int).sum() / mask.size
            score = round(score, 4)

            color = np.random.randint(0, 255, 3)
            hex_color = self.rgb_to_hex(color)
            rgba_color = np.append(color, [128])

            colored_mask = np.zeros((*mask.shape, 4), dtype=np.uint8)
            colored_mask[mask] = rgba_color
            mask_pil = Image.fromarray(colored_mask, mode="RGBA")
            buffered = io.BytesIO()
            mask_pil.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            label_name = self.id2label.get(label, f"class_{label}")
            segments.append({
                'label': label_name,
                'color': hex_color,
                'score': score,
                'base64': img_base64
            })

        return segments
