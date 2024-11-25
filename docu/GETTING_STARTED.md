# Getting Started

1) Open this project in terminal.
2) Run "npm i" to install the global node_modules. You only need to do it once.

## 1. Initialize the database (only do it once)

<ol>
<li>Open this project in the new terminal.</li>
<li>Run <code>cd server</code> to navigate to the folder with the backend.</li>
<li>Run <code>node databaseInit.js</code></li>
</ol>

## 2. Run Backend

Prerequisites: you need to habe node.js (https://nodejs.org/en/download/package-manager), python3 and pip (https://www.python.org/downloads/) installed.

<ol>
<li>Open this project in the new terminal.</li>
<li>Run <code>cd server</code> to navigate to the folder with the backend.</li>
<li>Run <code>npm i</code> to install the backend node_modules.</li>
<li>Run <code>node server.js</code> to start the js server.</li>
</ol>

Now you need to run the python server, so:
<ol>
<li>Open a new terminal, navigate to the server directory with <code>node server.js</code> and create a virtual environment with <code>python3 -m venv venv</code>, you only need to create the venv once.</li>
<li>Activate it using <code>source venv/bin/activate</code> on macOS/Linux or <code>venv\Scripts\activate</code> on Windows; you will need to do it every time you start the project.</li>
<li>Install the dependencies <code>pip install -r requirements.txt</code>, you also need to do it only once.</li>
<li>Start your server with <code>python3 server.py</code></li>
</ol>

## 3. Run Frontend 

Prerequisites: you need to have Angular installed, use https://v17.angular.io/guide/setup-local to install.

1) Open this project in terminal.
3) Run "cd compare-face-segmentation" to switch to the folder with the frontend.
4) Run "npm i" once again to install the frontend node_modules. You only need to do it once.
5) Run "ng s" (or "ng serve") to run the app.
6) By default, the application will be accessible at http://localhost:4200, open it in your browser.


## Troubleshooting

- Sometimes there is a problem with starting the python server, in this case you need to reinstall torch: <code>pip uninstall torch torchvision torchaudio -y</code> and <code>pip install torch</code> in the "python" terminal.
- If there are some further problems, feel free to create an issue, I will look into it as soon as possible.