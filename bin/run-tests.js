#!/usr/bin/env node

const { exec } = require('child_process');

console.log('cwd', process.cwd());
exec('sh ./bin/run-tests.sh', (error, stdout, stderr) => {
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
