#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const shelljs = require('shelljs');

console.log('starting issuer...');
shelljs.exec('cd ..');
shelljs.exec('npm run start:issuer');

// execSync('npm run start:issuer', {
//   cwd: path.join(__dirname, '../')
// });
console.log('issuer started, running tests');
shelljs.exec('npm run test');
// execSync('npm run test', {
//   cwd: path.join(__dirname, '../')
// });
console.log('tests have been run, stopping issuer');
shelljs.exec('npm run stop:issuer');
// execSync('npm run stop:issuer', {
//   cwd: path.join(__dirname, '../')
// });
console.log('vc test suite compliance run finished');
