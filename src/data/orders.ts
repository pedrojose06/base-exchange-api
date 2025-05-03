const now = Date.now();

// PARA SIMULAR UMA BASE DE DADOS PREENCHIDA, CRIAR ORDER NESSE ARQUIVO


export default [
  {
    id: '1',
    instrument: 'PETR4',
    side: 1,
    price: 5.34, 
    quantity: 10,
    remainingQuantity: 2,
    status: 'open',
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
  },
  
];