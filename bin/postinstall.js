#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('vc-test-suite postinstall js script');

exec(`sh ${__dirname}/postinstall.sh`, {
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
