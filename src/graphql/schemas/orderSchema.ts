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

  input OrderInput { 
    instrument: String!
    side: Int!
    price: Float!
    quantity: Float!
  }

  type Query {
    orders: [Order],
    order(id: ID): Order
  }

  type Mutation {
    updateOrderStatus(id: ID!, status: String!): Order
    insertOrder(order: OrderInput!): Order
  }
`;