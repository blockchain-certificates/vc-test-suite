/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
/*global describe, it*/
const config = require('../../config.js');
const chai = require('chai');
const {expect} = chai;
const util = require('./util');

// configure chai
chai.use(require('chai-as-promised'));

const generatorOptions = config;

describe('Basic Documents (negative tests)', function() {
  before(function() {
    const notSupported = generatorOptions.sectionsNotSupported || [];
    if(notSupported.includes('basic')) {
      this.skip();
    }
  });

  describe('@context', function() {
    it('MUST be one or more URIs (negative)', async function() {
      await expect(util.generate(
        'example-1-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: A more specific type: AlumniCredential, was detected, yet no context seems provided for that type');
    });

    it('first value MUST be https://www.w3.org/2018/credentials/v1 (negative)',
    async function() {
      await expect(util.generate(
        'example-1-bad-url.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'First @context declared must be https://www.w3.org/2018/credentials/v1, was given https://www.w3.org/2018/credentials/examples/v1');
    });
  });

  describe('`id` properties', function() {
    it('MUST be a single URI (negative)', async function() {
      await expect(util.generate(
        'example-2-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, '"@id" value must be a string.');
    });
  });

  describe('`type` properties', function() {
    it('MUST be one or more URIs (negative)', async function() {
      await expect(util.generate(
        'example-3-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `type` property must be an array');
    });

    it('for Credential MUST be `VerifiableCredential` plus specific type (negative)', async function() {
      await expect(util.generate(
        'example-3-bad-missing-type.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `type` property must be an array with at least `VerifiableCredential` or `VerifiablePresentation` value');
    });
  });

  describe('`credentialSubject` property', function() {
    it('MUST be present (negative - credentialSubject missing)', async function() {
      await expect(util.generate(
        'example-014-bad-no-credential-subject.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `credentialSubject` property must be defined');
    });
  });

  describe('`issuer` property', function() {
    it('MUST be present (negative - missing issuer)', async function() {
      await expect(util.generate(
        'example-4-bad-missing-issuer.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `issuer` property must be defined');
    });

    it('MUST be a single URI (negative - not URI)', async function() {
      await expect(util.generate(
        'example-4-bad-issuer-uri.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, '`issuer` property must be a URL string or an object with an `id` property containing a URL string');
    });

    it('MUST be a single URI (negative - Array)', async function() {
      await expect(util.generate(
        'example-4-bad-issuer-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, '`issuer` property must be a URL string or an object with an `id` property containing a URL string');
    });
  });

  describe('`issuanceDate` property', function() {
    it('MUST be present (negative - missing issuanceDate)', async function() {
      await expect(util.generate(
        'example-4-bad-missing-issuanceDate.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `issuanceDate` property must be defined');
    });

    it('MUST be an RFC3339 datetime (negative - RFC3339)', async function() {
      await expect(util.generate(
        'example-4-bad-issuanceDate.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `issuanceDate` property must be a valid RFC3339 string. Value received: `01/01/2010`');
    });

    it('MUST be an RFC3339 datetime (negative - Array)', async function() {
      await expect(util.generate(
        'example-4-bad-issuanceDate-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `issuanceDate` property must be a valid RFC3339 string. `[\'2010-01-01T19:23:24Z\', \'2010-01-01T19:23:25Z\']` value is not a string');
    });
  });

  describe('`expirationDate` property', function() {
    it('MUST be an RFC3339 datetime (negative - RFC3339)', async function() {
      await expect(util.generate(
        'example-6-bad-expirationDate.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `expirationDate` property must be a valid RFC3339 string. Value received: `01/01/2020`');
    });

    it('MUST be an RFC3339 datetime (negative - Array)', async function() {
      await expect(util.generate(
        'example-6-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: `expirationDate` property must be a valid RFC3339 string. `[\'2020-01-01T19:23:24Z\', \'2021-01-01T19:23:24Z\']` value is not a string');
    });
  });

  xdescribe('Presentations', function() {
    it('MUST include `verifiableCredential` and `proof` (negative - missing `verifiableCredential`)', async function() {
      await expect(util.generatePresentation(
        'example-8-bad-missing-verifiableCredential.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'ValueError: A Verifiable Presentation must contain valid verifiableCredential(s)');
    });

    it('MUST include `verifiableCredential` and `proof` (negative - missing `proof`)', async function() {
      await expect(util.generatePresentation(
        'example-8-bad-missing-proof.jsonld', generatorOptions))
        .to.be.rejectedWith(Error, 'yo yo yo'); // TODO: not passing
    });
  });
});
