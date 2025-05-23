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

  type OrderHistoryDetail {
    orderId: ID!
    executedQuantity: Int!
    quantity: Int!
    createdAt: String!
  }

  type PaginatedOrders {
    totalPages: Int!
    orders: [Order]!
  }

  type Query {
    orders(limit: Int, page: Int): PaginatedOrders,
    order(id: ID): Order
    ordersByFilter(filters: FiltersInput, limit: Int, page: Int): PaginatedOrders
    orderHistoryDetailById(id: ID!): [OrderHistoryDetail]!
  }

  type Mutation {
    updateOrderStatus(id: ID!, status: String!): Order
    insertOrder(order: OrderInput!): Order
  }
`;