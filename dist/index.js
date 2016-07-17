'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _selenium = require('./src/selenium');

var _selenium2 = _interopRequireDefault(_selenium);

var _chromedriver = require('./src/chromedriver');

var _chromedriver2 = _interopRequireDefault(_chromedriver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('Getting selenium');
                        _context.next = 3;
                        return (0, _selenium2.default)(path);

                    case 3:
                        console.log('Got selenium');

                        console.log('Getting chromedriver');
                        _context.next = 7;
                        return (0, _chromedriver2.default)(path);

                    case 7:
                        console.log('Got chromedriver');

                    case 8:
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