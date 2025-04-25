import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Order {
    id: ID!
    product: String!
    quantity: Int!
    price: Float!
    total: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    orders: [Order]
  }
`;

const orders = [
  {
    id: '1',
    instrument: 'Book 1',
    side: 2,
    price: 10.0,
    quantity: 2,
    remainingQuantity: 0,
    status: 'closed',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '2',
    instrument: 'Book 2',
    side: 1,
    price: 15.0,
    quantity: 1,
    remainingQuantity: 0,
    status: 'closed',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z'
  }
        
];

const resolvers = {
  Query: {
    orders: () => orders,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
  
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);