#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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
  console.log('running vc compliance test with report');
  exec('echo "this works"');
  console.log('current dir:', __dirname);
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



if (command === 'set-config') {
  console.log('editing vc-test-suite config located at', path.join(__dirname, '..', 'config.blockcerts.json'));
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.blockcerts.json'), {
    encoding: 'utf8'
  }));
  console.log('current config', config);
  const option = process.argv[3];
  console.log('change option', option);
  const value = process.argv[4];
  console.log('with value', value);
  if (config[option].includes(value)) {
    console.log('option already contains this value, skipping');
  } else {
    const newValue = value.split(' ');
    let currentValue = config[option].split(' ');

    const optionKey = newValue[0];
    if (currentValue.includes(optionKey)) {
      const optionIndex = currentValue.findIndex(currentOption => currentOption === optionKey);
      currentValue[optionIndex + 1] = newValue[1];
    } else {
      currentValue = newValue.concat(currentValue);
    }
    const newValueString = currentValue.join(' ');
    config[option] = newValueString;
  }
  console.log('new config', config);
  fs.writeFileSync(path.join(__dirname, '..', 'config.blockcerts.json'), JSON.stringify(config, null, 2));
  console.log('done updating config');
}
