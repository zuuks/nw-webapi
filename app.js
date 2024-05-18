const express = require('express');
const app = express();
const exec = require('child_process').exec;
const path = require('path');
const port = 1337;

const serverDir = "C:\\FXServer\\server-data";
const serverFile = "pokreni.bat";

const styles = `
<style>
    body {
        background: linear-gradient(-45deg, #3a3939, rgba(0, 0, 0, 0.794));
    }
    .main {
        width: 700px;
        height: 400px;
        background-color: rgb(93, 16, 16);
        margin: auto;
        border-radius: 50px;
        border: 5px solid rgb(143, 18, 18);
    }
    .logo {
        width: 500px;
        height: 40px;
        margin: auto;
        margin-left: 230px;
        color: white;
    }
    hr {
        margin-top: 5px;
        border: 2px solid rgb(143, 18, 18);
        border-radius: 90%;
        width: 50%;
        margin-left: 25% !important;
        margin-right: 25% !important;
    }
    .menu {
        margin-top: 30px;
    }
    a {
        color: white;
        text-decoration: none;
        background-color: rgb(97, 97, 97);
        padding: 10px 20px;
        border-radius: 10px;
        margin-left: 260px;
    }
    a:last-child {
        margin-left: 10px;
    }
    a:hover {
        color: rgb(181, 2, 2);
        transition: 0.3s;
    }
    .status {
        color: white;
        margin-left: 295px;
        margin-top: 30px;
        font-size: 20px;
    }
    .info {
        color: white;
        margin-left: 305px;
        margin-top: 160px;
    }
</style>`;

const generateHTML = (status) => `
<head>
    <title>NoWay Interface</title>
    ${styles}
</head>
<body>
    <div class="main">
        <div class="logo">
            <h1>SERVER PANEL</h1>
        </div>
        <hr>
        <div class="menu">
            <a href='/stop'>Stop</a>
            <a href='/restart'>Up/Restart</a>
        </div>
        <p class="status">Status: <span style="color: ${status ? 'green' : 'black'};">${status ? 'Upaljen' : 'Ugašen'}</span></p>
        <p class="info">NoWay Interface</p>
    </div>
</body>
</html>`;

const isRunning = (query) => {
    return new Promise((resolve, reject) => {
        exec('tasklist', (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve(stdout.toLowerCase().includes(query.toLowerCase()));
        });
    });
};

app.get("/", async (req, res) => {
    try {
        const status = await isRunning('fxserver.exe');
        res.send(generateHTML(status));
    } catch (error) {
        res.status(500).send("Error checking server status");
    }
});

app.get("/restart", async (req, res) => {
    try {
        await exec("taskkill /IM fxserver.exe /F");
        await exec(`cd ${serverDir} && start ${serverFile}`);
        console.log("Restarted");
        setTimeout(() => {
            res.redirect('/');
        }, 500);
    } catch (error) {
        res.status(500).send("Error restarting server");
    }
});

app.get("/start", async (req, res) => {
    try {
        await exec(`cd ${serverDir} && ${fxServerPath} +exec server.cfg`);
        console.log("Started");
        res.send("Started");
    } catch (error) {
        res.status(500).send("Error starting server");
    }
});

app.get("/stop", async (req, res) => {
    try {
        await exec("taskkill /IM fxserver.exe /F");
        console.log("Stopped");
        setTimeout(() => {
            res.redirect('/');
        }, 500);
    } catch (error) {
        res.status(500).send("Error stopping server");
    }
});

app.listen(port, () => {
    console.log(`Web Interface upaljen na portu: ${port}`);
});
