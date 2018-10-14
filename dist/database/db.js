'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/davids-grand-server';

exports.default = db;