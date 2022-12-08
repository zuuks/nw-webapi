var express = require('express')
var app = express()
var url = require('url');
var exec = require("child_process").exec

var server_dir = "C:\\FXServer\\server-data";
var server_file = "pokreni.bat";

var key = "gavran";
var port = 1337;

app.get("/", function(request, response){ 
	isRunning('fxserver.exe', (status) => {
		if (status ==true){
			response.send(`<head>    <title>NoWay Interface</title>    <style>        body{            background: linear-gradient(-45deg, #3a3939, rgba(0, 0, 0, 0.794));                    }        .main{            width: 700px;            height: 400px;            background-color: rgb(93, 16, 16);            margin: auto;            border-radius: 50px;            border: 5px solid rgb(143, 18, 18);        }        .logo{            width: 500px;            height: 40px;            margin: auto;            margin-left: 230px;            color: white;        }        hr{            margin-top: 5px;            border: 2px solid rgb(143, 18, 18);            border-radius: 90%;            width: 50%;            margin-left: 25% !important;            margin-right: 25% !important;        }        .menu{            margin-top: 30px;        }        a{            color: white;            text-decoration: none;            background-color: rgb(97, 97, 97);            padding: 10px 20px;            border-radius: 10px;            margin-left: 260px;        }        a:last-child{            margin-left: 10px;        }        a:hover{            color: rgb(181, 2, 2);            transition: 0.3s;        }        .status{            color: white;            margin-left: 295px;            margin-top: 30px;            font-size: 20px;        }        .info{            color: white;            margin-left: 305px;            margin-top: 160px;        }    </style></head><body>    <div class="main">        <div class="logo">            <h1>SERVER PANEL</h1>        </div>        <hr>        <div class="menu">            <a href='/stop'>Stop</a>            <a href='/restart'>Up/Restart</a>        </div>        <p class="status">Status: <span style="color: green;">Upaljen</span></p>        <p class="info">NoWay Interface</p>                </div></body></html>`);
		}
		else{
			response.send(`<head>    <title>NoWay Interface</title>    <style>        body{            background: linear-gradient(-45deg, #3a3939, rgba(0, 0, 0, 0.794));                    }        .main{            width: 700px;            height: 400px;            background-color: rgb(93, 16, 16);            margin: auto;            border-radius: 50px;            border: 5px solid rgb(143, 18, 18);        }        .logo{            width: 500px;            height: 40px;            margin: auto;            margin-left: 230px;            color: white;        }        hr{            margin-top: 5px;            border: 2px solid rgb(143, 18, 18);            border-radius: 90%;            width: 50%;            margin-left: 25% !important;            margin-right: 25% !important;        }        .menu{            margin-top: 30px;        }        a{            color: white;            text-decoration: none;            background-color: rgb(97, 97, 97);            padding: 10px 20px;            border-radius: 10px;            margin-left: 260px;        }        a:last-child{            margin-left: 10px;        }        a:hover{            color: rgb(181, 2, 2);            transition: 0.3s;        }        .status{            color: white;            margin-left: 295px;            margin-top: 30px;            font-size: 20px;        }        .info{            color: white;            margin-left: 305px;            margin-top: 160px;        }    </style></head><body>    <div class="main">        <div class="logo">            <h1>SERVER PANEL</h1>        </div>        <hr>        <div class="menu">            <a href='/stop'>Stop</a>            <a href='/restart'>Up/Restart</a>        </div>        <p class="status">Status: <span style="color: black;">Ugasen</span></p>        <p class="info">NoWay Interface</p>                </div></body></html>`);
		}
	})
});

app.get("/restart", function(request, response){ 
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
		exec("taskkill /IM fxserver.exe /f", (error, stdout, stderr) => { 
			exec("cd "+server_dir+" && start "+server_file, (error, stdout, stderr) => { 
				console.log("Restart");
			})
		})
		setTimeout(() => {
			response.redirect('/')
		  }, 500)
	
});

app.get("/start", function(request, response){ 
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	exec("cd "+server_dir+" && C:\\FXServer\\server\\FXServer.exe +exec server.cfg", (error, stdout, stderr) => { 
		console.log("Started");
	})
	response.send("Started");
	
});

app.get("/stop", function(request, response){ 
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
		exec("taskkill /IM fxserver.exe /f", (error, stdout, stderr) => { 	
			console.log("Stopped");
		})
		setTimeout(() => {
			response.redirect('/')
		  }, 500)
		  
	
});

app.listen(port);
console.log("Web Interface upaljen na portu: "+ port);
const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}
