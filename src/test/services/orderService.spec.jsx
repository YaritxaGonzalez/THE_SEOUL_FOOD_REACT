import { createOrder, getOrders, getOrderById } from '../../services/orderService';
import { resetStorage } from '../test-utils';

const datos = {
  customer: 'cliente@correo.cl',
  items: [{ id: '01', name: 'Chapagetti', price: 3990, quantity: 2 }],
  total: 7980,
};

describe('orderService', () => {
  beforeEach(resetStorage);

  it('sin órdenes devuelve una lista vacía', () => {
    expect(getOrders()).toEqual([]);
  });

  it('createOrder guarda la orden con id y estado', () => {
    const orden = createOrder(datos);
    expect(orden.id).toContain('ORD-');
    expect(orden.status).toBe('Pagada');
    expect(getOrders().length).toBe(1);
  });

  it('getOrderById encuentra una orden o devuelve undefined', () => {
    const orden = createOrder(datos);
    expect(getOrderById(orden.id).total).toBe(7980);
    expect(getOrderById('no-existe')).toBeUndefined();
  });
});