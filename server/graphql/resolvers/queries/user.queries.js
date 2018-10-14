import User from '../../../database/models/User';

export default {
  me: (parent, args, ctx, info) => {
    console.log(ctx.req.userId);
    if (!ctx.req.userId) {
      return null;
    }
    return User.findById(ctx.req.userId);
  }
};
