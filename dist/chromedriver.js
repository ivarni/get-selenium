'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fileExists = require('file-exists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var filename = 'chromedriver_linux64.zip';
var unzipFilename = 'chromedriver';

var latestVersionUrl = 'http://chromedriver.storage.googleapis.com/LATEST_RELEASE';
var fallbackVersion = '2.22';

var getLatestVersion = function getLatestVersion() {
    return new Promise(function (resolve) {
        var version = fallbackVersion;
        _request2.default.get(latestVersionUrl).on('data', function (data) {
            return version = data.toString();
        }).on('error', function (error) {
            return console.log(error);
        }).on('end', function () {
            return resolve(version.trim());
        });
    });
};

var getArchitecture = function getArchitecture() {
    var platform = process.platform;
    var bitness = process.arch.substring(1);
    switch (platform) {
        case 'linux':
            return { platform: platform, bitness: bitness };
        case 'darwin':
            return { platform: 'mac', bitness: '32' };
        case 'win32':
            return { platform: 'win', bitness: '32' };
        default:
            throw new Error('Unsupported platform: ' + platform);
    }
};

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(targetFolder) {
        var file, version, _getArchitecture, platform, bitness, url, exists, hash;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        file = _path2.default.join(targetFolder, filename);
                        _context.next = 3;
                        return getLatestVersion();

                    case 3:
                        version = _context.sent;
                        _getArchitecture = getArchitecture();
                        platform = _getArchitecture.platform;
                        bitness = _getArchitecture.bitness;
                        url = 'https://chromedriver.storage.googleapis.com/' + version + '/chromedriver_' + platform + bitness + '.zip';
                        exists = (0, _fileExists2.default)(_path2.default.join(targetFolder, unzipFilename));

                        if (exists) {
                            _context.next = 17;
                            break;
                        }

                        _context.next = 12;
                        return (0, _util.getFile)(url, targetFolder, filename);

                    case 12:
                        hash = _context.sent;
                        _context.next = 15;
                        return (0, _util.checkHash)(_path2.default.join(targetFolder, filename), hash);

                    case 15:
                        _context.next = 17;
                        return (0, _util.unzip)(_path2.default.join(targetFolder, filename));

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();