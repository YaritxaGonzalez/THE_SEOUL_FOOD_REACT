import { api } from './api';

const STATUS = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
};

// Para el selector de estado del admin
export const ORDER_STATES = Object.entries(STATUS).map(([value, label]) => ({ value, label }));

// Backend → frontend (los componentes siguen usando id, date, customer, items...)
function toOrder(o) {
  return {
    id: String(o.id),
    date: o.fecha,
    customer: o.clienteEmail,
    customerName: o.clienteNombre,
    status: STATUS[o.estado] ?? o.estado,
    statusCode: o.estado,
    total: o.total,
    items: o.detalles.map((d) => ({
      id: String(d.productoId),
      name: d.producto,
      price: d.precioUnitario,
      quantity: d.cantidad,
    })),
  };
}

// Solo ADMIN y VENDEDOR. El backend ordena como las guardó, así que se invierte
// para dejar las más recientes primero
export async function getOrders() {
  const list = await api.get('/ordenes');
  return list.map(toOrder).reverse();
}

export async function getOrderById(id) {
  return toOrder(await api.get(`/ordenes/${id}`));
}

// Recibe los items del carrito ([{ product, quantity }]).
// El backend calcula precios y total, y descuenta el stock.
export async function createOrder(items) {
  const created = await api.post('/ordenes', {
    items: items.map(({ product, quantity }) => ({
      productoId: Number(product.id),
      cantidad: quantity,
    })),
  });
  return toOrder(created);
}

// Solo ADMIN. Si el estado es CANCELADA, el backend devuelve el stock.
export async function updateOrderStatus(id, estado) {
  return toOrder(await api.put(`/ordenes/${id}/estado`, { estado }));
}