import User from '../../database/models/User';
import Book from '../../database/models/Book';
import Author from '../../database/models/Author';

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
    }).exec();

    const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);

    ctx.res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    // return user to the browser
    return user;
  },
  signIn: async (parent, args, ctx, info) => {
    const { email, password } = args;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }

    // Check password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid password`);
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // console.log('hello');
    return user;
  },
  signOut: (parent, args, ctx, info) => {
    ctx.res.clearCookie('token');
    return { message: 'Signed out!' };
  },
  addBook: async (parent, args, ctx, info) => {
    const { title, author } = args;
    const authorFromDb = await Author.findOneAndUpdate(
      { name: author },
      { name: author },
      { upsert: true }
    ).exec();
    const book = await Book.findOneAndUpdate(
      { title },
      { title, author: authorFromDb._id },
      { upsert: true, returnNewDocument: true }
    ).exec();
    return book;
  }
};

export default userMutations;
