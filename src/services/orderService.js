const ORDERS_KEY = 'seoulfood_ordenes';

function read() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

// Cuando exista el backend, estas funciones pasan a usar fetch
// (GET /orders, GET /orders/{id} y POST /orders). El resto de la app no cambia.

// Las más recientes primero
export function getOrders() {
  return [...read()].reverse();
}

export function getOrderById(id) {
  return read().find((o) => o.id === id);
}

export function createOrder({ customer, items, total }) {
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer,
    items, // [{ id, name, price, quantity }]
    total,
    status: 'Pagada',
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([...read(), order]));
  return order;
}