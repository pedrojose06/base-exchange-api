import orders from "../../data/orders";


export interface IOrder {
  id: string;
  instrument: string;
  side: number;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}


export const orderResolvers = {
  Query: {
    orders: (_: unknown, args: { limit?: number; offset?: number }): IOrder[] => {
      const { limit, offset } = args;

      const paginatedOrders = orders.slice(offset || 0, (offset || 0) + (limit || orders.length));
      return paginatedOrders;
    },
    order: (_: unknown, args: { id: string }): IOrder | null => {
      const order = orders.find(order => order.id === args.id);
      if (order?.instrument) {
        return order;
      }
      return null;
    },
    ordersByStatus: (_: unknown, args: { status: string }): IOrder[] => {
      if (!args.status) {
        return orders;
      }
      const filteredOrders = orders.filter(order => order.status === args.status);
      if (filteredOrders.length > 0) {
        return filteredOrders;
      }
      throw new Error(`No orders found with status: ${args.status}`);
    },
    ordersBySide: (_: unknown, args: { side: number }): IOrder[] => {
      if (args.side !== 1 && args.side !== 2) {
        return orders;
      }
      const filteredOrders = orders.filter(order => order.side === args.side);
      if (filteredOrders.length > 0) {
        return filteredOrders;
      }
      throw new Error(`No orders found with side: ${args.side}`);
    }
  },
  Mutation: {
    updateOrderStatus: (_: unknown, { id, status }: { id: string; status: string }): IOrder | null => {
      const order = orders.find(order => order.id === id);
      if (order) {
        order.status = status; 
        order.updatedAt = new Date().toISOString(); 
        return order; 
      }
  
      throw new Error(`Order with ID ${id} not found`);
    },
    insertOrder: (_: unknown, { order }: { order: IOrder }): IOrder => {
      const newOrder = {
        ...order,
        id: (orders.length + 1).toString(), 
        status: 'open',
        remainingQuantity: order.quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      return newOrder;
    }
  },
};
