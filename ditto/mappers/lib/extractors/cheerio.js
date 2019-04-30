const cheerio = require('cheerio');

module.exports = (document, path) => {

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
