import User from '../../database/models/User';
import Book from '../../database/models/Book';
import Author from '../../database/models/Author';
import Person from '../../database/models/Person';
import EyeColor from '../../database/models/EyeColor';
import Company from '../../database/models/Company';
import testData from '../../../json/test.json';

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
  },
  createTestData: async (parent, args, ctx, info) => {
    console.log(testData.length);
    testData.map(async (item) => {
      const eyePromise = await EyeColor.findOneAndUpdate(
        { color: item.eyeColor },
        { color: item.eyeColor },
        { upsert: true, new: true }
      ).exec();
      console.log('eye test done');
      const companyTest = await Company.findOneAndUpdate(
        { name: item.company },
        { name: item.company },
        { upsert: true, new: true }
      );
      console.log('companytest done');
      const personTest = await Person.findOneAndUpdate(
        { email: item.email },
        {
          name: item.email,
          age: item.age,
          eyeColor: eyePromise._id,
          gender: item.gender,
          company: companyTest._id
        },
        { upsert: true, new: true }
      );
    });
    return 'Success 👌👍✌😎';
  }
};

export default userMutations;
