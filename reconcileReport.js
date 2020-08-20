const fs = require('fs');
const path = require('path');
const testConfig = require('./config.json');

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

function saveInFile (tests) {
  const targetFilePath = path.join(__dirname, 'implementations', 'blockcerts-step-by-step-report.json');
  const fileContent = JSON.parse(fs.readFileSync(targetFilePath, 'utf-8'));
  const jwtTests = fileContent.tests.filter(test => test.fullTitle.startsWith(sections.jwt));
  fileContent.tests = tests.concat(jwtTests);
  fs.writeFileSync(
    path.join(__dirname, 'implementations', 'blockcerts-reconciled-report.json'),
    JSON.stringify(fileContent, null, 2));
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

function reconcileReport () {
  const supportedTests = testConfig.sectionsNotSupported;

  const files = supportedTests.filter(suiteName => suiteName !== 'jwt').map(suiteName => ({
    fileName: `report-${suiteName}.json`,
    sectionName: sections[suiteName]
  }));
  let allTests = [];
  files.forEach(file => {
    const fileName = file.fileName;
    console.log('reading', fileName);
    const testResult = JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));
    const tests = testResult.suites
      .reduce((testsList, suite) => {
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
      }, []);
    allTests = allTests.concat(tests);

    saveInFile(allTests);
  });
}

reconcileReport();
