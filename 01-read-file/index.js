const fs = require('fs');
const path = require('path');
const {stdout} = require('process');

const redableFilePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(redableFilePath, 'utf-8');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));