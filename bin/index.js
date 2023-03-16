#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const command = process.argv[2];

console.log('cwd', process.cwd());

if (command === 'test') {
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
}

if (command === 'report:blockcerts') {
  exec(`sh ${__dirname}/run-blockcerts-report.sh`, {
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
}
