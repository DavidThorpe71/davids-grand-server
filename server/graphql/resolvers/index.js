import userQueries from './queries/user.queries';
import userMutations from './mutations/user.mutations';
import userUnions from './unions/user.unions';

export default {
  Mutation: {
    ...userMutations
  },
  Query: {
    ...userQueries
  },
  ...userUnions
};
