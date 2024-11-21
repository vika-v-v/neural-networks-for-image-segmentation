const sharp = require("sharp");

let fetch;
let pipeline, env;

(async () => {
  fetch = (await import("node-fetch")).default;
  const transformers = await import("@xenova/transformers");
  pipeline = transformers.pipeline;
  env = transformers.env;
  env.allowLocalModels = false;
})();

const labelMapping = {
  "background": "Background",
  "skin": "Skin",
  "nose": "Nose",
  "eye_g": "Eye Glasses",
  "l_eye": "Left Eye",
  "r_eye": "Right Eye",
  "l_brow": "Left Eyebrow",
  "r_brow": "Right Eyebrow",
  "l_ear": "Left Ear",
  "r_ear": "Right Ear",
  "mouth": "Mouth/Area between lips",
  "u_lip": "Upper Lip",
  "l_lip": "Lower Lip",
  "hair": "Hair",
  "hat": "Hat",
  "ear_r": "Earring",
  "neck_l": "Necklace",
  "neck": "Neck",
  "cloth": "Clothing"
};

function mapLabel(technicalLabel) {
  return labelMapping[technicalLabel] || technicalLabel;
}

async function processImageWithModel(imageUrl) {
  const model = await pipeline(
    "image-segmentation",
    "jonathandinu/face-parsing"
  );

  const output = await model(imageUrl);

  let segments = [];

  await Promise.all(
    output.map(async (segment) => {
      try {
        const color = getRandomColor();
        const maskImage = createMaskImage(segment.mask, color);
        const overlay = {
          input: Buffer.from(maskImage),
          raw: {
            width: segment.mask.width,
            height: segment.mask.height,
            channels: 4,
            premultiplied: false,
          },
        };

        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();
        const processedImageBuffer = await sharp(Buffer.from(maskImage), {
          raw: {
            width: segment.mask.width,
            height: segment.mask.height,
            channels: 4,
          },
        })
          .png()
          .toBuffer();

        const processedImageData = processedImageBuffer.toString("base64");
        const hexColor = rgbToHex(color.r, color.g, color.b, color.a);
        const label = mapLabel(segment.label);

        segments.push({
          label: label, 
          color: hexColor, 
          score: segment.score, 
          base64: processedImageData
        });
      } catch (error) {
        console.log("Error processing image segment:", error);
        return;
      }
    })
  );

  return segments;
}

function createMaskImage(mask, color) {
  let maskImage = new Uint8ClampedArray(mask.width * mask.height * 4);
  for (let i = 0; i < mask.data.length; i++) {
    const idx = i * 4;
    if (mask.data[i] === 255) {
      // Mask is present
      maskImage[idx] = color.r;
      maskImage[idx + 1] = color.g;
      maskImage[idx + 2] = color.b;
      maskImage[idx + 3] = 100; // Fully opaque
    } else {
      maskImage[idx] = 0;
      maskImage[idx + 1] = 0;
      maskImage[idx + 2] = 0;
      maskImage[idx + 3] = 0; // Fully transparent
    }
  }
  return maskImage;
}

const getRandomColor = () => {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: 0.25,
  };
};

function rgbToHex(r, g, b, a = 1) {
  // Convert each RGB component to a hexadecimal string
  const red = r.toString(16).padStart(2, "0");
  const green = g.toString(16).padStart(2, "0");
  const blue = b.toString(16).padStart(2, "0");

  // Convert alpha from a range of 0-1 to 0-255 then to a hex string
  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

  // Concatenate each component into a single hexadecimal string prefixed with '#'
  return `#${red}${green}${blue}${alphaHex}`;
}

module.exports = processImageWithModel;
