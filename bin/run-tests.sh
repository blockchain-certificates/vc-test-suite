#!/usr/bin/env

echo "starting issuer..."
npm run start:issuer
echo "issuer started, running tests"
npm run test
echo "tests have been run, stopping issuer"
npm run stop:issuer
echo "vc test suite compliance run finished"
