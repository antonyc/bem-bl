var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path'),
    SYS = require('util'),

    readFile = BEM.require('./util').readFile;

exports.getBuildResultChunk = function(relPath, path, suffix) {

    return readFile(path)
        .then(function(c) {

            return [
                '/* ' + path + ': start */',
                c,
                '/* ' + path + ': end */',
                '\n'
            ].join('\n');

        });

};

exports.getBuildResult = function(prefixes, suffix, outputDir, outputName) {

    var _this = this;
    return this.filterPrefixes(prefixes, ['bemhtml'])
        .then(function(paths) {
            return Q.all(paths.map(function(path) {
                return _this.getBuildResultChunk(
                    PATH.relative(outputDir, path), path, suffix);
            }));
        })
        .then(function(sources) {
            sources = sources.join('\n');

            var BEMHTML = require('../../__html/lib/bemhtml');

            return BEMHTML.translate(sources);
        });

};

exports.storeBuildResults = function(prefix, res) {
    var _this = this,
        suffix = 'bemhtml.js';
    return Q.when(res, function(res) {
        return _this.storeBuildResult(_this.getPath(prefix, suffix), suffix, res['bemhtml']);
    });
};

exports.getSuffixes = function() {
    return ['bemhtml'];
};
