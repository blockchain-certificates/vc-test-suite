#!/usr/bin/env

pwd
echo "installing mocha globally"
npm i -g mocha mocha-spec-json-output-reporter chai
echo "starting issuer..."
npm run start:issuer
echo "issuer started, running blockcerts reporting tests"
TESTS_DIR=./test/vc-data-model-1.0

for ENTRY in "$TESTS_DIR"/*.js
do
  REPORT_NAME=${ENTRY%.js*}
  REPORT_NAME=${REPORT_NAME##*/}
  echo $REPORT_NAME
  mocha "$ENTRY" -R mocha-spec-json-output-reporter --reporter-options fileName=report-${REPORT_NAME}.json,hierarchy=true
done
echo "tests have been run, stopping issuer"
npm run stop:issuer
echo "vc test suite compliance run finished, compiling results"
node reconcileReport.js
npm run summary:blockcerts
