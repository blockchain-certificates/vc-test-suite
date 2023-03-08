/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
/*global describe, it*/
const config = require('../../config.json');
const chai = require('chai');
const {expect} = chai;
const util = require('./util');
const { hasType } = util;

// setup constants
const uriRegex = /\w+:(\/?\/?)[^\s]+/;

// RFC3339regex

// configure chai
const should = chai.should();
chai.use(require('chai-as-promised'));

const generatorOptions = config;

let documents = {} // [key:string]: SignedDocument
describe('Basic Documents (positive tests)', function() {
  before(async function () {
    const notSupported = generatorOptions.sectionsNotSupported || [];
    if(notSupported.includes('basic')) {
      this.skip();
    }

    try {
      documents = await util.batchDocuments([
        'example-1.jsonld',
        'example-1-object-context.jsonld',
        'example-2.jsonld',
        'example-3.jsonld',
        'example-4.jsonld',
        'example-6.jsonld',
        'example-8.jsonld',
        'example-014-credential-subjects.jsonld'
      ], generatorOptions);
    } catch (e) {
      console.error(e);
    }
  });

  describe('@context', function() {
    it('MUST be one or more URIs', function() {
      const doc = documents['example-1.jsonld'];
      doc.should.have.property('@context');
      doc['@context'].should.be.a('Array');
      doc['@context'].should.have.length.greaterThan(1);
    });

    it('first value MUST be https://www.w3.org/2018/credentials/v1', function() {
      const doc = documents['example-1.jsonld'];
      expect(doc['@context'][0]).to.equal('https://www.w3.org/2018/credentials/v1');
    });

    it('subsequent items can be objects that express context information', function() {
      const doc = documents['example-1-object-context.jsonld'];
      expect(doc['@context'][2]).to.eql({
        "image": { "@id": "schema:image", "@type": "@id" }
      });
    });
  });

  describe('`id` properties', function() {

    it('MUST be a single URI', function() {
      const doc = documents['example-2.jsonld'];
      doc.id.should.be.a('string');
      expect(doc.id).to.match(uriRegex);
      doc.credentialSubject.id.should.be.a('string');
      expect(doc.credentialSubject.id).to.match(uriRegex);
    });
  });

  describe('`type` properties', function() {

    it('MUST be one or more URIs', function() {
      const doc = documents['example-3.jsonld'];
      doc.type.should.be.a('Array');
    });

    it('for Credential MUST be `VerifiableCredential` plus specific type', function() {
      const doc = documents['example-3.jsonld'];
      doc.type.should.have.length.greaterThan(1);
      doc.type.should.include('VerifiableCredential');
    });
  });

  describe('`credentialSubject` property', function() {
    it('MUST be present', function() {
      const doc = documents['example-1.jsonld'];
      doc.should.have.property('credentialSubject');
      expect(doc.credentialSubject.id).to.match(uriRegex);
    });

    it('MUST be present, may be a set of objects', function() {
      const doc = documents['example-014-credential-subjects.jsonld'];
      doc.credentialSubject.should.be.a('Array');
      expect(doc.credentialSubject[0].id).to.match(uriRegex);
      expect(doc.credentialSubject[1].id).to.match(uriRegex);
    });
  });

  describe('`issuer` property', function() {
    it('MUST be present', function() {
      const doc = documents['example-4.jsonld'];
      doc.should.have.property('issuer');
      expect(doc.issuer).to.match(uriRegex);
    });

    it('MUST be a single URI', function() {
      const doc = documents['example-4.jsonld'];
      doc.issuer.should.be.a('string');
      expect(doc.issuer).to.match(uriRegex);
    });
  });

  describe('`issuanceDate` property', function() {
    it('MUST be present', function() {
      const doc = documents['example-4.jsonld'];
      doc.should.have.property('issuanceDate');
    });

    it('MUST be an RFC3339 datetime', function() {
      const doc = documents['example-4.jsonld'];
      doc.issuanceDate.should.be.a('string');
      expect(doc.issuanceDate).to.match(util.RFC3339regex);
    });
  });

  describe('`expirationDate` property', function() {
    it('MUST be an RFC3339 datetime', function() {
      const doc = documents['example-6.jsonld'];
      doc.expirationDate.should.be.a('string');
      expect(doc.expirationDate).to.match(util.RFC3339regex);
    });
  });

  describe('Presentations', function() {

    it('MUST be of type `VerifiablePresentation`', function() {
      const doc = documents['example-8.jsonld'];
      expect(hasType(doc, 'VerifiablePresentation')).to.be.true;
    });

    it('MUST include `verifiableCredential` and `proof`', function() {
      const doc = documents['example-8.jsonld'];
      should.exist(doc.verifiableCredential);
      should.exist(doc.proof);
    });
  });

});
