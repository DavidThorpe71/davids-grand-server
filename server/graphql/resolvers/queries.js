import User from '../../database/models/User';
import Author from '../../database/models/Author';

export default {
  me: (parent, args, ctx, info) => {
    console.log(ctx.req.userId);
    if (!ctx.req.userId) {
      return null;
    }
    return User.findById(ctx.req.userId).exec();
  },
  authors: (parent, args, ctx, info) => Author.find()
};
