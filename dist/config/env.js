'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDebug = exports.GOOGLE_ANALYTICS_ID = exports.ENV = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const ENV = process.env.NODE_ENV || 'development';

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;

const isDebug = ENV === 'development';

exports.ENV = ENV;
exports.GOOGLE_ANALYTICS_ID = GOOGLE_ANALYTICS_ID;
exports.isDebug = isDebug;