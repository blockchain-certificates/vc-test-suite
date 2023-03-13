#!/usr/bin/env node

const { exec } = require('child_process');

console.log("starting issuer...");
exec("npm run start:issuer");
console.log("issuer started, running tests");
exec("npm run test");
console.log("tests have been run, stopping issuer");
exec("npm run stop:issuer");
console.log("vc test suite compliance run finished");
