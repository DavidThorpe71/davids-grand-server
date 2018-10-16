import Book from '../../database/models/Book';
import Author from '../../database/models/Author';

export default {
  Author: {
    books: (parent, args, ctx, info) => {
      const { _id } = parent;
      return Book.find({ author: _id });
    }
  },
  Book: {
    author: (parent, args, ctx, info) => {
      const { author } = parent;
      return Author.findById(author);
    }
  }
};
