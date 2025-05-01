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
    orders: (_: unknown, args: { limit?: number; page?: number }): { totalPages: number; orders: IOrder[] } => {
      const { limit = 5, page = 1 } = args;
    
      // Calculate the total number of pages
      const totalPages = Math.ceil(orders.length / limit);
    
      // Calculate the offset based on the page number
      const offset = (page - 1) * limit;
    
      // Paginate the orders based on offset and limit
      const paginatedOrders = orders.slice(offset, offset + limit);
    
      return {
        totalPages,
        orders: paginatedOrders,
      };
    },
    order: (_: unknown, args: { id: string }): IOrder | null => {
      const order = orders.find(order => order.id === args.id);
      if (order?.instrument) {
        return order;
      }
      return null;
    },
    ordersByFilter: (
      _: unknown,
      { filters, limit = 5, page = 1 }: { filters: IFiltersInput; limit?: number; page?: number }
    ): { totalPages: number; orders: IOrder[] } => {
      let filteredOrders = orders;
    
      // Apply filters dynamically only if they have valid values
      if (filters.id && filters.id.trim() !== "") {
        filteredOrders = filteredOrders.filter(order => order.id === filters.id);
      }
      if (filters.instrument && filters.instrument.trim() !== "") {
        filteredOrders = filteredOrders.filter(order =>
          order.instrument.toLowerCase().includes(filters.instrument.toLowerCase())
        );
      }
      if (filters.side !== undefined && filters.side !== 0) {
        filteredOrders = filteredOrders.filter(order => order.side === filters.side);
      }
      if (filters.status && filters.status.trim() !== "") {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }
      if (filters.createdAt && filters.createdAt.trim() !== "") {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === filters.createdAt;
        });
      }
    
      // Calculate pagination
      const totalPages = Math.ceil(filteredOrders.length / limit);
      const offset = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(offset, offset + limit);
    
      return {
        totalPages,
        orders: paginatedOrders,
      };
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
