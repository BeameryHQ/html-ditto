
const _  = require('lodash');
const cheerio = require('cheerio');

const comparator = require('./comparator');

module.exports = class Extractor {

    constructor(plugins, transformer){
        this.plugins = plugins;
        this.transformer = transformer;
    }

    extract (document, path, output) {

        const extractor = this;

        if (_.isNil(path)) return;

        if (path === '!') return document;

        if (path.includes('??') ){
            const parameters = _.zipObject(['source', 'targetValue', 'comparator', 'comparison', 'condition'],
                path.match(/(.+?)\?\?(.+?)\#(.*)\#(.+)/));
            const _comparator = extractor.transformer.transform(document, parameters.comparator, output);
            const _condition = extractor.transformer.transform(document, parameters.condition, output);

            return comparator(parameters.comparison, _comparator, _condition) ? extractor.transformer.transform(document, parameters.targetValue, output) : null;

        } else if (_.startsWith(path, '>>')) {
            return _.startsWith(path, '>>%') ? eval(path.replace('>>%', '')) : path.replace('>>', '');
        } if (_.startsWith(path, '!')) {
            return _.get(output, path.replace('!', ''));
        } else if (/\|\|/.test(path) && !path.includes('??') ) {
            let pathWithDefault = path.split(/\|\|/);
            return extractor.extract(document, pathWithDefault[0], output) ||
            extractor.extract(document, `${pathWithDefault[1]}`, output);
        } else {

            const $ = cheerio.load(document);

            let extraction, attribute, transformation;

            if (path.includes('%%')) {
                transformation = path.split('%%')[1];
                path = path.split('%%')[0];

            }
            if (path.endsWith('*')) {
                return $(`${path}`).children();
            } else {
                path = path.replace('*', '');
                if (path.includes('^^')) {
                    extraction = path.split('^^')[1];
                    path = path.split('^^')[0];
                    if (/\(([^)]+)\)/.test(extraction)) {
                        let _attributes = extraction.match(/\(([^)]+)\)/);
                        attribute = _attributes[1];
                        extraction = extraction.replace(_attributes[0], '');
                    }
                }
            }

            const transformData = (data, transformation) => {
                switch(transformation) {
                    case "BOOLEAN":
                        return ["true", "false"].includes(data.toLowerCase()) ?  JSON.parse(data) : null;
                    default: return data;
                }
            }
            const getPathData = (extraction) => {

                if (!extraction) extraction = 'TEXT';

                try {
                    switch(extraction.toUpperCase()) {
                        case 'TEXT':
                            return $(`${path}`).text();
                        case 'HTML':
                            return $(`${path}`).html();
                        case 'DATA':
                            return $(`${path}`).data(`${attribute}`);
                        case 'VALUE':
                            return $(`${path}`).val();
                        case 'ATTR':
                            return $(`${path}`).attr(`${attribute}`);
                        case 'DATA':
                            return $(`${path}`).data(`${attribute}`);
                    }

                } catch (error) {
                    return null;
                }
            }

            return transformData(getPathData(extraction), transformation);
        }
    }

}