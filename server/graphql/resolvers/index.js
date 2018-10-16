import queries from './queries';
import mutations from './mutations';
import unions from './unions';

export default {
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  },
  ...unions
};
