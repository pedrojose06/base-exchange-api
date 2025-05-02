import orders from "../../data/orders";
import ordersHistory from "../../data/ordersHistory";


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

export interface IOrdersHistoryDetail {
  orderId: string;
  executedQuantity: number;
  quantity: number;
  createdAt: string;
}

function insertOrderHistory( orderId: string, executedQuantity: number, quantity: number): IOrdersHistoryDetail {
  const newOrderHistory = {
    orderId: orderId,
    executedQuantity: executedQuantity,
    quantity: quantity,
    createdAt: new Date().toISOString(),
  };
  ordersHistory.push(newOrderHistory);
  return newOrderHistory;
}

export const orderResolvers = {
  Query: {
    orders: (_: unknown, args: { limit?: number; page?: number }): { totalPages: number; orders: IOrder[] } => {
      const { limit = 5, page = 1 } = args;
    
      const totalPages = Math.ceil(orders.length / limit);
    
      const offset = (page - 1) * limit;

      const sortedOrders = orders.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
      const paginatedOrders = sortedOrders.slice(offset, offset + limit).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
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
    
      const totalPages = Math.ceil(filteredOrders.length / limit);
      const offset = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(offset, offset + limit);
    
      return {
        totalPages,
        orders: paginatedOrders,
      };
    },
    orderHistoryDetailById: (_: unknown, { id }: { id: string }): IOrdersHistoryDetail[] | null => {
      const order = orders.find(order => order.id === id);
      const orderHistoryDetail = ordersHistory.filter(order => order.orderId === id).map(orderHistoryDetail => ({
        orderId: orderHistoryDetail.orderId,
        executedQuantity: orderHistoryDetail.executedQuantity,
        quantity: order.quantity,
        createdAt: orderHistoryDetail.createdAt,
      }));

      return orderHistoryDetail;
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
    
      const otherOrders = orders
        .filter(o =>
          o.side === (newOrder.side === 1 ? 2 : 1) &&
          o.instrument === newOrder.instrument &&
          (o.status === 'open' || o.status === 'pending') &&
          o.remainingQuantity > 0)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
      for (const otherOrder of otherOrders) {
        if (newOrder.remainingQuantity === 0) break;
    
        const executedQuantity = Math.min(newOrder.remainingQuantity, otherOrder.remainingQuantity);
    
        newOrder.remainingQuantity -= executedQuantity;
        otherOrder.remainingQuantity -= executedQuantity;

        newOrder.status = 'pending';
        otherOrder.status = 'pending';
        newOrder.updatedAt = new Date().toISOString();
        otherOrder.updatedAt = new Date().toISOString();

        if (otherOrder.remainingQuantity === 0) {    
          otherOrder.status = 'executed';
        }
        if (newOrder.remainingQuantity === 0) {
          newOrder.status = 'executed';
        }
    
        insertOrderHistory(otherOrder.id, executedQuantity, otherOrder.quantity);
        insertOrderHistory(newOrder.id, executedQuantity, newOrder.quantity);
      }
    
      orders.push(newOrder);
      return newOrder;
    },

  },
};
