var port = process.env.PORT || 8081
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
    console.log('healthcheck')
    res.status(200).json('build server node-env:' + process.env.NODE_ENV);
});

app.get('/deploy_web/:apps_version_idx', function (req, res) {
    console.log('deploy_web -' + req.params.apps_version_idx);
    loop.deployWeb(req.params.apps_version_idx);
    res.status(200).json('deploy_web server node-env:' + process.env.NODE_ENV);
});

app.get('/', function (req, res) {
    res.status(200).json('build server node-env:' + process.env.NODE_ENV);
});

app.use('/static', express.static(config.app.storage_path, {
    maxage: '1h',
    etag: false
}));

app.listen(port, function () {
    console.log("http://localhost:" + port);
    console.log("NODE_ENV:" + process.env.NODE_ENV);

});
loop.buildLoop();
console.log("config:", config);


