'use strict';

var _                = require('lodash');
const assert         = require('assert');
const ditto        = require('../ditto/ditto');

describe('Ditto', () =>  {

    let dummySample   = require('./samples/sample');
    let dummyResult   = require('./results/sample');
    let dummyMappings = require('./mappings/sample');

    let dummyPlugin   = {
      transformTwitterHandle: (target) => {
          const twitterHandle = target.match(/^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([^\/]+)(\/\w+)*$/);
          return !!twitterHandle ? `@${twitterHandle[3]}` : null;
      }
    };

    before(() => {
        return new ditto(dummyMappings, dummyPlugin).unify(dummySample).then((result) => {
            this.result = result;
        });
    });

    it('should be able to map an object with a direct flat mapping', () => {
        assert.strictEqual(this.result.name, dummyResult.name);
    });

    it('should be able to map nested object', () => {
        assert.deepStrictEqual(this.result.email, dummyResult.email);
    });

    it('should be able to create an array of values by iterating over a set of DOM elements', () => {
        assert.equal(this.result.experiences.length, 2);
        assert.equal(this.result.experiences[0], 'beamery');
        assert.equal(this.result.experiences[1], 'SAP');
    });

    it('should be able to map an array of objects based on iterating one or more target paths', () => {
        assert.deepStrictEqual(this.result.social_links.length, 5);
    });

    it('should be able to map an array based on iterating one or more target paths', () => {
        assert.deepStrictEqual(this.result.links_all.length, 5);
    });

    it('should be able to map an object based on iterating one or more target paths', () => {
        assert.deepStrictEqual(_.size(this.result.social_links_objectified), 5);
    });

    it('should be able to assign a value based on the value of iterating an array', () => {
        assert.strictEqual(this.result.social_links[0].value, "http://a.com");
    });

    it('should be able to assign a value based on the index of iterating a DOM element', () => {
        assert.strictEqual(this.result.social_links[0].order, 0);
    });

    it('should be able to assign a value based on iterating nested DOM path', () => {
        assert.deepStrictEqual(this.result.messaging[0], {
            "service": "skype",
            "type": "messaging",
            "value": "ahmad.a.assaf"
        });
    });

    it('should be able to filter output by single "required" field', () => {
        assert.strictEqual(this.result.messaging.length, 1);
    });

    it('should be able to filter output by the multiple "required" fields', () => {
        assert.strictEqual(_.get(this.result, `education_object_location`, null), null);
    });

    it('should be able to define an object key as the value of iterating nested DOM element', () => {
        assert.strictEqual(_.keys(this.result.social_links_objects)[0]
            , "388495550d157e5c5d299b7ecfeb1c2d");
    });

    it('should be able to create an array of objects by iterating over a nested/sub DOM paths', () => {
        assert.deepStrictEqual(this.result.education, dummyResult.education);
    });

    it('should be able to ignore parsing objects that have a false/null/undefined values', () => {
        assert.equal(this.result.social_links.length, 5);
    });

    it('should cover all the cases defined by the ditto interface', () => {
        assert.deepStrictEqual(this.result, dummyResult);
    });

    describe('Ditto extractor', () =>  {

        it('should be able to allow for duplicate values without flattening/compacting them', () => {
            assert.strictEqual(this.result.fullName, "Ahmad Ahmad AbdelMuti Assaf");
        });
        it('should be able to parse a unicode string', () => {
            assert.strictEqual(this.result.bio, dummyResult.bio);
        });
        it('should be able to extract textual value using the tag name', () => {
            assert.deepStrictEqual(this.result.email, dummyResult.email);
        });
        it('should be able to extract textual value using the class (.) selector', () => {
            assert.strictEqual(this.result.name, dummyResult.name);
        });
        it('should be able to extract textual value using the ID (#) selector', () => {
            assert.deepStrictEqual(this.result.links, dummyResult.links);
        });
        it('should be able to extract textual value using pseudo (:) selector', () => {
            assert.deepStrictEqual(this.result.experience, dummyResult.experience);
        });
        it('should be able to extract data attributes value', () => {
            assert.strictEqual(this.result.bio, dummyResult.bio);
        });
        it('should be able to extract attributes value', () => {
            assert.deepStrictEqual(this.result.links_all, dummyResult.links_all);
        });

        describe('Hard-coding operator >>', () =>  {
            it('should be able to assign a value based on a hard-coded string', () => {
                assert.strictEqual(this.result.social_links[0].order, 0);
            });

            it('should be able to assign a boolean value based on a hard-coded boolean', () => {
                assert.strictEqual(this.result.social_links[0].social, true);
            });

            it('should be able to pass a hard-coded value as a function argument', () => {
                assert.strictEqual(this.result.primaryPhoto, dummyResult.primaryPhoto);
            });
        });

        describe('Contextual mapping operator !', () =>  {
            it('should be able to assign a new value based on an already extracted simnple one', () => {
                assert.strictEqual(this.result.displayName, "Ahmad Ahmad AbdelMuti Assaf");
            });

            it('should be able to pass an already extracted simple value as a function argument', () => {
                assert.strictEqual(this.result.completeName, dummyResult.completeName);
            });

        });

        describe('Default assignment operator ||', () =>  {
            it('should extract a default hard-coded value if a flat value is not found', () => {
                assert.strictEqual(this.result.nickname, "nickname_not_found");
                assert.strictEqual(this.result.isNickNameFound, false);
            });

            it('should extract a default value extracted from the mapping if a flat value is not found', () => {
                assert.strictEqual(this.result.isDynamicDefault, this.result.name);
            });

            it('should extract a default value if a nested property is not found', () => {
                assert.strictEqual(this.result.education_object['f9470907075133dfd6fb7df67c5f0d5a'].location, 'N/A')
            });

            it('should extract a default value if an extracted output is not found', () => {
                assert.strictEqual(this.result.fullNameDefaultHardcoded, 'default')
            });

            it('should extract a default value as a function argument', () => {
                assert.strictEqual(this.result.fullName, 'Ahmad Ahmad AbdelMuti Assaf')
            });

            it('should extract a default value as a function argument if the argument mapping is not found', () => {
                assert.strictEqual(this.result.fullName_default, 'Ahmad Ahmad AbdelMuti Assaf')
            });
        });

        describe('Conditional assignment operator ??', () =>  {

            it('should assign a value based on a condition where comparator is a mapped value and comparison is a hardcoded value', () => {
                assert.deepStrictEqual(this.result.website_addresses_keyless[0].value, "https://gravatar.com/ahmadassaf");
                assert.deepStrictEqual(this.result.website_addresses_keyless.length, 3);
            });

            it('should assign a value based on a condition where target value is a function result', () => {
                assert.deepStrictEqual(this.result.social_media_addresses[0].value, "@ahmadaassaf");
            });

            it('should assign a value based on a condition where target value is a hardcoded value', () => {
                assert.deepStrictEqual(this.result.website_addresses_keyless[0].owner, "ahmadassaf");
            });

            it('should assign a value based on a condition that includes nested function calls', () => {
                assert.deepStrictEqual(this.result.messaging[0].value, "ahmad.a.assaf");
                assert.deepStrictEqual(this.result.messaging.length, 1);
            });

        });
    });

    describe('Ditto transformer', () =>  {

        it('should be able to apply a custom function', () => {
            assert.strictEqual(this.result.fullName, dummyResult.fullName);
        });

        it('should be able to execute a native JavaScript function', () => {
            assert.strictEqual(this.result.createdAt, dummyResult.createdAt);
        });

        it('should be able to pass a function as a function argument', () => {
            assert.strictEqual(this.result.messaging[0].type, 'messaging');
        });

        it('should be able to apply nested functions as function arguments', () => {
            assert.strictEqual(this.result.messaging[0].value, 'ahmad.a.assaf');
        });

    });
});
