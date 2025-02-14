const { expect } = require('chai');
const js = { schemaFormat: 'mySchema', traits: [{headers: {type: 'object',properties: {'my-app-header': {type: 'integer',minimum: 0,maximum: 100}}}}], headers: { properties: { test1: { type: 'string' }, test2: { type: 'number' } } }, payload: { test: true }, 'x-parser-original-payload': { testing: true }, correlationId: { test: true }, 'x-parser-original-schema-format': 'application/vnd.apache.avro;version=1.9.0', contentType: 'application/json', messageId: 'test', title: 'Test', summary: 'test', description: 'testing', externalDocs: { test: true }, tags: [{ name: 'tag1' }], bindings: { amqp: { test: true } }, examples: [{name: 'test', summary: 'test summary', payload: {test: true}}], 'x-test': 'testing' };

const Message = require('../../lib/models/message');

const { assertMixinDescriptionInheritance } = require('../mixins/description_test');
const { assertMixinExternalDocsInheritance } = require('../mixins/external-docs_test');
const { assertMixinTagsInheritance } = require('../mixins/tags_test');
const { assertMixinBindingsInheritance } = require('../mixins/bindings_test');
const { assertMixinSpecificationExtensionsInheritance } = require('../mixins/specification-extensions_test');

describe('Message', function() {
  describe('#uid()', function() {
    it('should return a string with the messageId', function() {
      const d = new Message(js);
      expect(d.uid()).to.be.equal('test');
    });

    it('should return a string with the name when messageId is not available', function() {
      const msg = { ...js, ...{ name: 'test', messageId: undefined } };
      const d = new Message(msg);
      expect(d.uid()).to.be.equal('test');
    });
    
    it('should return a string with the x-parser-message-name extension when name and messageId are not available', function() {
      const msg = { ...js, ...{ 'x-parser-message-name': 'test', messageId: undefined } };
      const d = new Message(msg);
      expect(d.uid()).to.be.equal('test');
    });
    
    it('should return a string with the base64 representation of the object when x-parser-message-name extension, name and messageId are not available', function() {
      const msg = { ...js, ...{ messageId: undefined } };
      const d = new Message(msg);
      expect(d.uid()).to.be.equal('eyJzY2hlbWFGb3JtYXQiOiJteVNjaGVtYSIsInRyYWl0cyI6W3siaGVhZGVycyI6eyJ0eXBlIjoib2JqZWN0IiwicHJvcGVydGllcyI6eyJteS1hcHAtaGVhZGVyIjp7InR5cGUiOiJpbnRlZ2VyIiwibWluaW11bSI6MCwibWF4aW11bSI6MTAwfX19fV0sImhlYWRlcnMiOnsicHJvcGVydGllcyI6eyJ0ZXN0MSI6eyJ0eXBlIjoic3RyaW5nIn0sInRlc3QyIjp7InR5cGUiOiJudW1iZXIifX19LCJwYXlsb2FkIjp7InRlc3QiOnRydWV9LCJ4LXBhcnNlci1vcmlnaW5hbC1wYXlsb2FkIjp7InRlc3RpbmciOnRydWV9LCJjb3JyZWxhdGlvbklkIjp7InRlc3QiOnRydWV9LCJ4LXBhcnNlci1vcmlnaW5hbC1zY2hlbWEtZm9ybWF0IjoiYXBwbGljYXRpb24vdm5kLmFwYWNoZS5hdnJvO3ZlcnNpb249MS45LjAiLCJjb250ZW50VHlwZSI6ImFwcGxpY2F0aW9uL2pzb24iLCJ0aXRsZSI6IlRlc3QiLCJzdW1tYXJ5IjoidGVzdCIsImRlc2NyaXB0aW9uIjoidGVzdGluZyIsImV4dGVybmFsRG9jcyI6eyJ0ZXN0Ijp0cnVlfSwidGFncyI6W3sibmFtZSI6InRhZzEifV0sImJpbmRpbmdzIjp7ImFtcXAiOnsidGVzdCI6dHJ1ZX19LCJleGFtcGxlcyI6W3sibmFtZSI6InRlc3QiLCJzdW1tYXJ5IjoidGVzdCBzdW1tYXJ5IiwicGF5bG9hZCI6eyJ0ZXN0Ijp0cnVlfX1dLCJ4LXRlc3QiOiJ0ZXN0aW5nIn0=');
    });
  });
  
  describe('#headers()', function() {
    it('should return a map of Schema objects', function() {
      const d = new Message(js);
      expect(d.headers().constructor.name).to.be.equal('Schema');
      expect(d.headers().json()).to.equal(js.headers);
    });
  });

  describe('#header()', function() {
    it('should return a specific Schema object', function() {
      const d = new Message(js);
      expect(d.header('test1').constructor.name).to.be.equal('Schema');
      expect(d.header('test1').json()).to.equal(js.headers.properties.test1);
    });
  });

  describe('#payload()', function() {
    it('should return payload as a Schema object', function() {
      const d = new Message(js);
      expect(d.payload().constructor.name).to.be.equal('Schema');
      expect(d.payload().json()).to.equal(js.payload);
    });
  });

  describe('#originalPayload()', function() {
    it('should return the original payload', function() {
      const d = new Message(js);
      expect(d.originalPayload()).to.equal(js['x-parser-original-payload']);
    });
  });

  describe('#correlationId()', function() {
    it('should return a CorrelationId object', function() {
      const d = new Message(js);
      expect(d.correlationId().json()).to.equal(js.correlationId);
    });
  });

  describe('#schemaFormat()', function() {
    it('should return a string', function() {
      const d = new Message(js);
      expect(d.schemaFormat()).to.equal('mySchema');
    });
  });

  describe('#originalSchemaFormat()', function() {
    it('should return a string', function() {
      const d = new Message(js);
      expect(d.originalSchemaFormat()).to.equal(js['x-parser-original-schema-format']);
    });
  });

  describe('#contentType()', function() {
    it('should return a string', function() {
      const d = new Message(js);
      expect(d.contentType()).to.equal(js.contentType);
    });
  });

  describe('#name()', function() {
    it('should return a string', function() {
      const d = new Message(js);
      expect(d.name()).to.equal(js.name);
    });
  });

  describe('#title()', function() {
    it('should return a string', function() {
      const d = new Message(js);
      expect(d.title()).to.equal(js.title);
    });
  });

  describe('#summary()', function() {
    it('should return a string', function() {
      const d = new Message(js);
      expect(d.summary()).to.equal(js.summary);
    });
  });

  describe('#traits()', function() {
    it('should return a list of traits from traits', function() {
      const d = new Message(js);
      expect(d.traits()[0].json()).to.equal(js.traits[0]);
    });

    it('should return a list of traits from x-parser-original-traits', function() {
      const { traits, ...newJs } = js;
      newJs['x-parser-original-traits'] = traits;
      const d = new Message(newJs);
      expect(d.traits()[0].json()).to.be.equal(newJs['x-parser-original-traits'][0]);
    });
  });

  describe('#hasTraits()', function() {
    it('should return true if in traits', function() {
      const d = new Message(js);
      expect(d.hasTraits()).to.equal(true);
    });

    it('should return true if in x-parser-original-traits', function() {
      const { traits, ...newJs } = js;
      newJs['x-parser-original-traits'] = traits;
      const d = new Message(newJs);
      expect(d.hasTraits()).to.equal(true);
    });

    it('should return false', function() {
      // eslint-disable-next-line no-unused-vars
      const { traits, ...newJs } = js;
      const d = new Message(newJs);
      expect(d.hasTraits()).to.equal(false);
    });
  });

  describe('#examples()', function() {
    it('should return an array of examples', function() {
      const d = new Message(js);
      expect(Array.isArray(d.examples())).to.be.equal(true);
      expect(d.examples()).to.be.equal(js.examples);
    });
  });

  describe('#mixins', function() {
    it('model should inherit from mixins', function() {
      assertMixinDescriptionInheritance(Message);
      assertMixinExternalDocsInheritance(Message);
      assertMixinTagsInheritance(Message);
      assertMixinBindingsInheritance(Message);
      assertMixinSpecificationExtensionsInheritance(Message);
    });
  });
});
