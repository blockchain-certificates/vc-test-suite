#!/usr/bin/env

pwd
echo "installing mocha globally"
npm i -g mocha
echo "starting issuer..."
npm run start:issuer
echo "issuer started, running tests"
tests_dir=./test/vc-data-model-1.0

for entry in "$tests_dir"/*.js
do
  mocha "$entry"
done
echo "tests have been run, stopping issuer"
npm run stop:issuer
echo "vc test suite compliance run finished"
