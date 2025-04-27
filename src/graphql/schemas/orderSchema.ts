import { gql } from 'graphql-tag';

export const orderTypeDefs = gql`
  type Order {
    id: ID!
    instrument: String!
    side: Int!
    price: Float!
    quantity: Float!
    remainingQuantity: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    orders: [Order],
    order(id: ID): Order
  }
  type Mutation {
  updateOrderStatus(id: ID!, status: String!): Order
}
`;
