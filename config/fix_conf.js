
var fs = require('fs');
const args = process.argv;
console.log(args);
console.log(__dirname);
const STORAGE_PATH = args[2];
const CACHE_URL = args[3];

const DB_NAME = args[4] || 'appflow';
const DB_HOST = args[5] || 'localhost';
const DB_USER = args[6] || 'root';
const DB_PASSWORD = args[7] || 'password';
const DB_PORT = args[8] || 3306;

function go() {
    console.log(__dirname);
    let content = fs.readFileSync(__dirname + '/config.prod.js', 'utf8');
    content = content.replace('!!storage_path!!', STORAGE_PATH);
    content = content.replace('!!cache_url!!', CACHE_URL);
    content = content.replace('!!db_name!!', DB_NAME);
    content = content.replace('!!db_host!!', DB_HOST);
    content = content.replace('!!db_user!!', DB_USER);
    content = content.replace('!!db_password!!', DB_PASSWORD);
    content = content.replace('!!db_port!!', Number(DB_PORT));
    fs.writeFileSync(__dirname + '/config.js', content, { encoding: 'utf8', flag: 'w' });
}

go();
