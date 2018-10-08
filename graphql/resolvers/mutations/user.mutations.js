import User from '../../../database/models/User';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userMutations = {
  createUser: async (parent, args, ctx, info) => {
    const { password, name } = args;
    let { email } = args;
    email = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
    try {
      ctx.res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
      });
    } catch (err) {
      console.log(err);
    }

    // return user to the browser
    return user;
  }
};

export default userMutations;
