'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _user = require('./queries/user.queries');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./mutations/user.mutations');

var _user4 = _interopRequireDefault(_user3);

var _user5 = require('./unions/user.unions');

var _user6 = _interopRequireDefault(_user5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({
  Mutation: _extends({}, _user4.default),
  Query: _extends({}, _user2.default)
}, _user6.default);