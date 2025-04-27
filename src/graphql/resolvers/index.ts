import { orderResolvers } from './orderResolver';

export const resolvers = {
  Query: {
    ...orderResolvers.Query,
  },
  Mutation: {
    ...orderResolvers.Mutation,
  },
};
