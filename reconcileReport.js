const fs = require('fs');
const path = require('path');

const sections = {
  'basic': 'Basic Documents',
  'status': 'Credential Status (optional)',
  'advanced': 'Advanced Documents',
  'ldp': 'Linked Data Proofs (optional)',
  'schema': 'Credential Schema (optional)',
  'refresh': 'Refresh Service (optional)',
  'tou': 'Terms of Use (optional)',
  'evidence': 'Evidence (optional)',
  'jwt': 'JWT (optional)',
  'zkp': 'Zero-Knowledge Proofs (optional)'
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

  const files = supportedTests.filter(suiteName => suiteName !== 'jwt').map(suiteName => ({
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
