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

export interface IFiltersInput {
  id?: string;
  instrument?: string;
  side?: number;
  status?: string;
  createdAt?: string;
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
    },
    ordersByDate: (_: unknown, args: { date: string }): IOrder[] => {
      if (!args.date) {
        return orders;
      }
    
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === args.date; 
      });
      if (filteredOrders.length > 0) {
        return filteredOrders;
      }
    
      throw new Error(`No orders found on date: ${args.date}`);
    },
    ordersByFilter: (_: unknown, { filters }: { filters: IFiltersInput }): IOrder[] => {
      let filteredOrders = orders;
      if (!filters || (filters.id ==='' && filters.instrument === '' && filters.side === 0 && filters.status === '' && filters.createdAt === '')) {
        return orders;
      }
      
      if (filters.id) {
        filteredOrders = filteredOrders.filter(order => order.id === filters.id);
      }
      if (filters.instrument) {
        filteredOrders = filteredOrders.filter(order =>
          order.instrument.toLowerCase().includes(filters.instrument.toLowerCase())
        );
      }
    
      if (filters.side) {
        filteredOrders = filteredOrders.filter(order => order.side === Number(filters.side));
      }
      if (filters.status) {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }
      
      if (filters.createdAt) {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === filters.createdAt;
        });
      }
    
      return filteredOrders;
    },
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
