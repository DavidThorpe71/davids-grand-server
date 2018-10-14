'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../../../database/models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  me: (parent, args, ctx, info) => {
    console.log(ctx.req.userId);
    if (!ctx.req.userId) {
      return null;
    }
    return _User2.default.findById(ctx.req.userId);
  }
};