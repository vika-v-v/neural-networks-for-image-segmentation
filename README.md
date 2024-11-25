# Neural Networks for Image Segmentation

A web application for comparing various AI models for image segmentation to help select the most suitable model for specific purposes.

## Overview

This platform enables users to compare different AI models for image segmentation, facilitating the selection of the most appropriate model based on specific requirements. One of the primary use cases is the comparison between two images to determine whether they depict the same person, a critical functionality for projects like ADRIAN (https://www.hsbi.de/wirtschaft/forschung/arbeitsgruppe-angewandte-ki/adrian).

## Demo:
<a href="[https://www.youtube.com/watch?v=8r734-SjsVU](https://www.youtube.com/watch?v=h4npzaNzisw)?autoplay=1" style="max-width: 80vw"></a>

## Features
<ul>
<li><b>Model Comparison:</b> Compare multiple AI models side by side to evaluate their performance on image segmentation tasks. Models which were used are:
<ul>
<li><b>jonathandinu/face-parsing</b> - https://huggingface.co/jonathandinu/face-parsing</li>
<li><b>mattmdjaga/segformer_b2_clothes</b> - https://huggingface.co/mattmdjaga/segformer_b2_clothes</li>
<li><b>nvidia/segformer-b0-finetuned-ade-512-512</b> - https://huggingface.co/nvidia/segformer-b0-finetuned-ade-512-512</li>
<li> ... and more models are coming up soon!</li>
</ul>
</li>
<li><b>Image Management:</b> Upload, edit, and manage images with associated categories for organized storage and retrieval.</li>
<li><b>Interactive Interface:</b> Visualize segmented images with overlay animations and detailed descriptions for better understanding and analysis.</li>
<li><b>Extensible Architecture:</b> Designed to easily incorporate additional AI models, allowing for continuous expansion and updates.</li>
</ul>

## Architecture
<ul>
<li><b>Frontend: Angular</b> – Provides a dynamic and responsive user interface.</li>
<li><b>Backend: Node.js with Express.js </b> – Handles API requests, business logic, and serves the frontend.</li>
<li><b>AI Processing: Python</b> – Executes AI models for image segmentation and processing tasks.</li>
<li><b>Database: SQLite</b> – Manages application data, including images, categories, and user information.</li>
</ul>
You can find a sceme for the architecture under <a href='./docu/Architecture.pdf'>docu/Architecture.pdf</a>.

## Getting Started

To get started with the project, please refer to the Get Started guide, which provides detailed instructions on setting up the development environment, installing dependencies, and running the application locally.

## Contributing

Contributions are welcome! Please follow these steps to contribute:
<ol>
<li>Fork the Repository</li>
<li>Create a New Branch: <code>git checkout -b feature/YourFeatureName
</code></li>
<li>Make and commit your changes</li>
<li>Push to the branch: <code>git push origin feature/YourFeatureName</code></li>
<li>Open a Pull Request</li>
</ol>
