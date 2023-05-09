const fs = require('fs');
const path = require('path');

const sections = {
  '10-basic-positives': 'Basic Documents',
  '11-basic-negatives': 'Basic Documents',
  '23-status': 'Credential Status (optional)',
  'advanced': 'Advanced Documents',
  '40-ldp': 'Linked Data Proofs (optional)',
  '20-schema': 'Credential Schema (optional)',
  '21-refresh': 'Refresh Service (optional)',
  '35-tou': 'Terms of Use (optional)',
  '22-evidence': 'Evidence (optional)',
  '50-jwt': 'JWT (optional)',
  '60-zkp': 'Zero-Knowledge Proofs (optional)'
}

function saveInFile (tests, stats) {
  const fileContent = {};
  fileContent.tests = tests;
  fileContent.stats = stats;
  fs.writeFileSync(
    path.join(__dirname, 'implementations', 'blockcerts-report.json'),
    JSON.stringify(fileContent, null, 2)
  );
}

function adjustZkpTitle (title, sectionName) {
  if (title.startsWith('Each credentialSchema...') || title.startsWith('Each proof...')) {
    title = `A verifiable credential... ${title}`;
  }

  if (title.startsWith('Each verifiable credential...')) {
    title = `A verifiable presentation... ${title}`;
  }
  console.log('adjust zkp title', title);
  return `${sectionName} ${title}`;
}

function getTestsIn (suites, file, sortedTests = []) {
  return suites.reduce((testsList, suite) => {
    if (suite.suites?.length > 0) {
      getTestsIn (suite.suites, file, testsList);
    }
    suite.tests.forEach(test => {
      if (test.result === 'passed' || test.result === 'failed') {
        if (!test.fullTitle.startsWith(file.sectionName)) {
          if (file.sectionName === sections.zkp) {
            test.fullTitle = adjustZkpTitle(test.fullTitle, file.sectionName);
          } else {
            test.fullTitle = `${file.sectionName} ${test.fullTitle}`;
          }
        }
        testsList.push(test);
      }
    });
    return testsList;
  }, sortedTests);
}

function reconcileReport () {
  const supportedTests = Object.keys(sections);

  const files = supportedTests.filter(suiteName => suiteName !== '50-jwt').map(suiteName => ({
    fileName: `report-${suiteName}.json`,
    sectionName: sections[suiteName]
  }));
  let allTests = [];
  let stats;
  files.forEach(file => {
    const fileName = file.fileName;
    try {
      console.log('reading', fileName);
      const fileContent = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
      const testResult = JSON.parse(fileContent);
      if (!stats) {
        stats = testResult.stats;
      }
      const tests = getTestsIn(testResult.suites, file);
      allTests = allTests.concat(tests);
    } catch (e) {
      console.log(e);
      console.log('File', fileName, 'not found, skipping report');
    }
  });
  console.log(allTests);
  saveInFile(allTests, stats);
}

reconcileReport();
