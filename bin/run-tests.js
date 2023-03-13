#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('cwd', process.cwd());
exec(`sh ${__dirname}/run-tests.sh`, {
  cwd: path.join(__dirname, '..')
}, (error, stdout, stderr) => {
  if (error) {
    console.error(error);
  }

  if (stdout) {
    console.log('stdout', stdout);
  }

  if (stderr) {
    console.log('stderr', stderr);
  }
});
