#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('starting issuer...');
execSync('npm run start:issuer', {
  cwd: path.join(__dirname, '../')
});
console.log('issuer started, running tests');
execSync('npm run test', {
  cwd: path.join(__dirname, '../')
});
console.log('tests have been run, stopping issuer');
execSync('npm run stop:issuer', {
  cwd: path.join(__dirname, '../')
});
console.log('vc test suite compliance run finished');
