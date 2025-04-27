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
    orders: () => orders,
    order: (_: unknown, args: { id: string }): IOrder | null => {
      const order = orders.find(order => order.id === args.id);
      if (order?.instrument) {
        return order;
      }
      return null;
    },
  },
  Mutation: {
    updateOrderStatus: (_: unknown, { id, status }: { id: string; status: string }): IOrder | null => {
      console.log('Orders before update:', orders); // Log the orders array before update
      console.log('ID being searched:', id); // Log the ID being searched for
  
      const order = orders.find(order => order.id === id);
      if (order) {
        console.log('Order found:', order); // Log the found order
        order.status = status; // Update the status
        order.updatedAt = new Date().toISOString(); // Update the `updatedAt` timestamp
        console.log('Orders after update:', orders); // Log the orders array after update
        return order; // Return the updated order
      }
  
      console.log('Order not found'); // Log if no order is found
      throw new Error(`Order with ID ${id} not found`);
    },
  },
};
