#!/usr/bin/env node

const { execSync } = require('child_process');

console.log("starting issuer...");
execSync("npm run start:issuer");
console.log("issuer started, running tests");
execSync("npm run test");
console.log("tests have been run, stopping issuer");
execSync("npm run stop:issuer");
console.log("vc test suite compliance run finished");
