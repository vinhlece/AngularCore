const shell = require('shelljs');
const path = require('path');

const portableDist = './dist/portable';

const files = [
  path.join(portableDist, 'runtime.js'),
  path.join(portableDist, 'polyfills.js'),
  path.join(portableDist, 'scripts.js'),
  path.join(portableDist, 'main.js'),
];

shell.cat(files).to('./dist/portable.js');
shell.rm('-rf', './dist/reporting--portable');
