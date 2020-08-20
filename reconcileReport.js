const fs = require('fs');
const path = require('path');
const testConfig = require('./config.json');

function reconcileReport () {
  const supportedTests = testConfig.sectionsNotSupported;

  const fileNames = supportedTests.filter(suiteName => suiteName !== 'jwt').map(suiteName => `report-${suiteName}.json`);
  let allTests = [];
  fileNames.forEach(fileName => {
    console.log('reading', fileName);
    const testResult = JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));
    const tests = testResult.suites
      .reduce((testsList, suite) => {
        suite.tests.forEach(test => {
          if (test.result === 'passed' || test.result === 'failed') {
            testsList.push(test);
          }
        });
        return testsList;
      }, []);
    allTests = allTests.concat(tests);
    // console.log(allTests.length);
    // console.log(allTests);
  });
}

reconcileReport();
