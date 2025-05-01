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

  input FiltersInput {
    id: ID
    instrument: String
    side: Int
    status: String
    createdAt: String
  }

  type Query {
    orders(limit: Int, offset: Int): [Order],
    order(id: ID): Order
    ordersByStatus(status: String!): [Order]
    ordersBySide(side: Int!): [Order]
    ordersByDate(date: String!): [Order]
    ordersByFilter(filters: FiltersInput): [Order]
  }

  type Mutation {
    updateOrderStatus(id: ID!, status: String!): Order
    insertOrder(order: OrderInput!): Order
  }
`;