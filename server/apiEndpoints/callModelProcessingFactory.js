const express = require('express');

const jonathandinu_face_parsing = require('./jonathandinu/face-parsing');
const mattmdjaga_segformer_b2_clothes = require('./mattmdjaga/segformer_b2_clothes');
const nvidia_segformer_b3_finetuned_ade_512_512 = require('./nvidia/segformer-b0-finetuned-ade-512-512');

async function callProcessImageWithModel(neuralNetworkId, imageUrl) {

    if(neuralNetworkId == 1) {
        return await jonathandinu_face_parsing(imageUrl);
    }
    else if(neuralNetworkId == 2) {
        return await mattmdjaga_segformer_b2_clothes(imageUrl);
    }
    else if(neuralNetworkId == 3) {
        return await nvidia_segformer_b3_finetuned_ade_512_512(imageUrl);
    }
    else {
        throw new Error('Neural network ID not found');
    }
}

module.exports = callProcessImageWithModel;