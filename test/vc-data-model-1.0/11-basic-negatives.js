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
        .to.be.rejectedWith(Error);
    });

    it('first value MUST be https://www.w3.org/2018/credentials/v1 (negative)',
    async function() {
      await expect(util.generate(
        'example-1-bad-url.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('`id` properties', function() {
    it('MUST be a single URI (negative)', async function() {
      await expect(util.generate(
        'example-2-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('`type` properties', function() {
    it('MUST be one or more URIs (negative)', async function() {
      await expect(util.generate(
        'example-3-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });

    it('for Credential MUST be `VerifiableCredential` plus specific type (negative)', async function() {
      await expect(util.generate(
        'example-3-bad-missing-type.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('`credentialSubject` property', function() {
    it('MUST be present (negative - credentialSubject missing)', async function() {
      await expect(util.generate(
        'example-014-bad-no-credential-subject.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('`issuer` property', function() {
    it('MUST be present (negative - missing issuer)', async function() {
      await expect(util.generate(
        'example-4-bad-missing-issuer.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
    it('MUST be a single URI (negative - not URI)', async function() {
      await expect(util.generate(
        'example-4-bad-issuer-uri.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });

    it('MUST be a single URI (negative - Array)', async function() {
      await expect(util.generate(
        'example-4-bad-issuer-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('`issuanceDate` property', function() {
    it('MUST be present (negative - missing issuanceDate)', async function() {
      await expect(util.generate(
        'example-4-bad-missing-issuanceDate.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
    it('MUST be an RFC3339 datetime (negative - RFC3339)', async function() {
      await expect(util.generate(
        'example-4-bad-issuanceDate.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });

    it('MUST be an RFC3339 datetime (negative - Array)', async function() {
      await expect(util.generate(
        'example-4-bad-issuanceDate-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('`expirationDate` property', function() {
    it('MUST be an RFC3339 datetime (negative - RFC3339)', async function() {
      await expect(util.generate(
        'example-6-bad-expirationDate.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });

    it('MUST be an RFC3339 datetime (negative - Array)', async function() {
      await expect(util.generate(
        'example-6-bad-cardinality.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });

  describe('Presentations', function() {
    it('MUST include `verifiableCredential` and `proof` (negative - missing `verifiableCredential`)', async function() {
      await expect(util.generatePresentation(
        'example-8-bad-missing-verifiableCredential.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });

    it('MUST include `verifiableCredential` and `proof` (negative - missing `proof`)', async function() {
      await expect(util.generatePresentation(
        'example-8-bad-missing-proof.jsonld', generatorOptions))
        .to.be.rejectedWith(Error);
    });
  });
});
