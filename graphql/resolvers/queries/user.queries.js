export default {
  me: (parent, args, ctx, info) => {
    console.log(ctx.req.userId);
  }
};
