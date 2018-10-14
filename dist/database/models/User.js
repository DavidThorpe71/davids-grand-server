'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Schema } = _mongoose2.default;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String
});

exports.default = _mongoose2.default.model('User', UserSchema);