# segformer_ade_handler.py
from transformers import SegformerFeatureExtractor, SegformerForSemanticSegmentation
from PIL import Image
import requests
import numpy as np
import io
import base64
import torch.nn.functional as F

class SegformerADEModel:
    def __init__(self, model_name):
        self.feature_extractor = SegformerFeatureExtractor.from_pretrained(model_name)
        self.model = SegformerForSemanticSegmentation.from_pretrained(model_name)
# https://huggingface.co/datasets/huggingface/label-files/blob/main/ade20k-id2label.json
        self.label_descriptions = [
            "Wall", "Building", "Sky", "Floor", "Tree", "Ceiling", "Road", "Bed", 
            "Windowpane", "Grass", "Cabinet", "Sidewalk", "Person", "Earth", "Door", 
            "Table", "Mountain", "Plant", "Curtain", "Chair", "Car", "Water", "Painting", 
            "Sofa", "Shelf", "House", "Sea", "Mirror", "Rug", "Field", "Armchair", "Seat", 
            "Fence", "Desk", "Rock", "Wardrobe", "Lamp", "Bathtub", "Railing", "Cushion", 
            "Base", "Box", "Column", "Signboard", "Chest of Drawers", "Counter", 
            "Sand", "Sink", "Skyscraper", "Fireplace", "Refrigerator", "Grandstand", 
            "Path", "Stairs", "Runway", "Case", "Pool Table", "Pillow", "Screen Door", 
            "Stairway", "River", "Bridge", "Bookcase", "Blind", "Coffee Table", "Toilet", 
            "Flower", "Book", "Hill", "Bench", "Countertop", "Stove", "Palm", "Kitchen Island", 
            "Computer", "Swivel Chair", "Boat", "Bar", "Arcade Machine", "Hovel", 
            "Bus", "Towel", "Light", "Truck", "Tower", "Chandelier", "Awning", "Streetlight", 
            "Booth", "Television Receiver", "Airplane", "Dirt Track", "Apparel", "Pole", 
            "Land", "Bannister", "Escalator", "Ottoman", "Bottle", "Buffet", "Poster", 
            "Stage", "Van", "Ship", "Fountain", "Conveyer Belt", "Canopy", "Washer", 
            "Plaything", "Swimming Pool", "Stool", "Barrel", "Basket", "Waterfall", 
            "Tent", "Bag", "Minibike", "Cradle", "Oven", "Ball", "Food", "Step", "Tank", 
            "Trade Name", "Microwave", "Pot", "Animal", "Bicycle", "Lake", "Dishwasher", 
            "Screen", "Blanket", "Sculpture", "Hood", "Sconce", "Vase", "Traffic Light", 
            "Tray", "Ashcan", "Fan", "Pier", "CRT Screen", "Plate", "Monitor", "Bulletin Board", 
            "Shower", "Radiator", "Glass", "Clock", "Flag"
        ]

    def rgb_to_hex(self, rgb):
        return f'#{int(rgb[0]):02x}{int(rgb[1]):02x}{int(rgb[2]):02x}'

    def segment_image(self, url):
        if url.startswith('http'):
                # It's a URL
            response = requests.get(url, stream=True)
            if response.status_code != 200:
                raise ValueError('Failed to fetch image from URL')
            image = Image.open(response.raw).convert("RGB")
        else:
            # Assume it's base64 encoded image data
            try:
                image_bytes = base64.b64decode(url)
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            except Exception as e:
                raise ValueError('Failed to decode base64 image data') from e


        image = Image.open(response.raw).convert("RGB")
        inputs = self.feature_extractor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)
        
        logits = outputs.logits.cpu()
        upsampled_logits = F.interpolate(logits, size=image.size[::-1], mode="bilinear", align_corners=False)
        pred_seg = upsampled_logits.argmax(dim=1)[0]

        segments = []
        unique_labels = np.unique(pred_seg.numpy())
        
        for label in unique_labels:
            score = (pred_seg == label).numpy()
            print(score)
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
                'label': self.label_descriptions[label],
                'color': hexColor,
                'score': score,
                'base64': img_base64
            })

        return segments
