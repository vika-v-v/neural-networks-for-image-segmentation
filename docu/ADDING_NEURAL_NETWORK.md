# How to add a neural network
1) Add Neural Network to the Database by calling the request like:
<code><pre>
INSERT INTO Neural_Network (nn_name) 
VALUES ("jonathandinu/face-parsing");
</pre></code>
with only adding the name. You can use the request from TablePlus 'Fill with data/Insert Neural Network'.
Remember the id.

2) Create a new file in server/apiEndpoints with the name of the network

3) Write and export the async function processImageWithModel(imageUrl) that takes the Image URL as a parameter and returns the array of segments, each segment is an object and has the structure:
<code><pre>
{
&emsp;label: <i>the name of the segment, f. e. hat or background</i>, 
&emsp;color: <i>hexadecimal color of the segment, please take into account that segments are drown above the picture, so it should be half-transparent</i>, 
&emsp;score: <i>the score of the label, is not mandatory</i>
&emsp;base64: <i>the base64 data of the segment, the data should only contain the segment without the original image</i>
}
</pre></code>
Use jonathandinu/face-parsing for reference.

4) Register it's id with the js-Endpoint in callModelProcessingFactory by calling the written function. Follow the structure:
<t><code><pre>
const [model variable] = require('[path to the model]');
...
async function callProcessImageWithModel(neuralNetworkId, imageUrl) {
&emsp;...
&emsp;else if(neuralNetworkId == [your id from the database from step 1]) {
&emsp;&emsp;return await [model variable] (imageUrl);
&emsp;}
}
</pre></code>

4) Do not add any other logic like saving segments or returning an api endpoint as it is handeled centrally for all neural networks in apiEndpoints/processImage.js

5) Register the new neural network in the factory by going to apiEndpoints/callModelProcessingFactory.js by adding the futher if-statement with the new neural network id and reference to the newly create function.
