var port = process.env.PORT || 8080
const config = require('./config/config');
const loop = require('./build_loop');
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

// LB 체크용 
app.get('/healthcheck', function (req, res) {
    res.status(200).json('build server node-env:' + process.env.NODE_ENV);
});



app.get('/', function (req, res) {
    res.status(200).json('build server node-env:' + process.env.NODE_ENV);
});

app.listen(port, function () {
    console.log("http://localhost:" + port);
    console.log("NODE_ENV:" + process.env.NODE_ENV);
    loop.buildLoop();
});

console.log("config:", config);


