'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkHash = exports.getFile = exports.unzip = undefined;

var _download = require('download');

var _download2 = _interopRequireDefault(_download);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _extractZip = require('extract-zip');

var _extractZip2 = _interopRequireDefault(_extractZip);

var _crypto = require('crypto');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseHashes = function parseHashes(rawHash) {
    // format: crc32c=qRiQ9g==, md5=AAQvmRLFWmGR17P+ASORNQ==
    var parse = function parse(result, hash) {
        var parts = hash.trim().split('=');
        var key = parts[0];
        var value = parts.splice(1).join('=');
        result[key] = value;
        return result;
    };

    var hashes = rawHash.split(',');
    return hashes.reduce(parse, {});
};

var unzip = exports.unzip = function unzip(file) {
    return new Promise(function (resolve, reject) {
        (0, _extractZip2.default)(file, { dir: _path2.default.dirname(file) }, function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

var getFile = exports.getFile = function getFile(url, savePath, saveName) {
    return new Promise(function (resolve, reject) {
        var hash = void 0;
        (0, _download2.default)(url).on('response', function (response) {
            hash = parseHashes(response.headers['x-goog-hash']).md5;
        }).on('error', function (error) {
            return reject(error);
        }).pipe(_fs2.default.createWriteStream(_path2.default.join(savePath, saveName))).on('finish', function () {
            resolve(hash);
        });
    });
};

var checkHash = exports.checkHash = function checkHash(filePath, hash) {
    return new Promise(function (resolve, reject) {
        var fileHash = (0, _crypto.createHash)('md5');
        _fs2.default.ReadStream(filePath).on('data', function (data) {
            return fileHash.update(data);
        }).on('end', function () {
            var digest = fileHash.digest('base64');
            if (hash === digest) {
                return resolve();
            }
            return reject('Checksum failed');
        });
    });
};