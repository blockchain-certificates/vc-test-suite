#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const shelljs = require('shelljs');

console.log('starting issuer...');
shelljs.cd(path.join(__dirname, '..'));
spawn('npm', ['run start:issuer'], {
  cwd: path.join(__dirname, '..')
}); // https://github.com/shelljs/shelljs/issues/426

console.log('cwd', process.cwd());
console.log('issuer started, running tests');
execSync('npm run test', {
  cwd: path.join(__dirname, '../')
});
console.log('tests have been run, stopping issuer');
execSync('npm run stop:issuer', {
  cwd: path.join(__dirname, '../')
});
console.log('vc test suite compliance run finished');
