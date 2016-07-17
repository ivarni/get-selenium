'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fileExists = require('file-exists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var minorVersion = '2.53';
var version = '2.53.0';
var filename = 'selenium.jar';

var seleniumUrl = 'http://selenium-release.storage.googleapis.com/' + minorVersion + '/selenium-server-standalone-' + version + '.jar';

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(targetFolder) {
        var file, exists, hash;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        file = _path2.default.join(targetFolder, filename);
                        exists = (0, _fileExists2.default)(file);

                        if (!exists) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt('return', file);

                    case 4:
                        _context.next = 6;
                        return (0, _util.getFile)(seleniumUrl, targetFolder, filename);

                    case 6:
                        hash = _context.sent;
                        _context.next = 9;
                        return (0, _util.checkHash)(file, hash);

                    case 9:
                        return _context.abrupt('return', file);

                    case 10:
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