import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../../services/orderService';
import { resetStorage, mockFetch, loginAs } from '../test-utils';
const ORDEN_API = {
  id: 7,
  clienteNombre: 'Cliente',
  clienteEmail: 'cliente@seoulfood.cl',
  fecha: '2026-11-22T18:00:00',
  estado: 'PENDIENTE',
  total: 7980,
  detalles: [
    {
      productoId: 1,
      producto: 'Nongshim Chapagetti',
      cantidad: 2,
      precioUnitario: 3990,
      subtotal: 7980,
    },
  ],
};

describe('orderService', () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it('getOrders pide GET /ordenes con el token y convierte la respuesta', async () => {
    loginAs('admin');
    const fetchSpy = mockFetch(200, [ORDEN_API]);
    const lista = await getOrders();

    const [url, opciones] = fetchSpy.calls.mostRecent().args;
    expect(url).toMatch(/\/ordenes$/);
    expect(opciones.headers.Authorization).toBe('Bearer token-de-prueba');
    expect(lista.length).toBe(1);
    expect(lista[0]).toEqual({
      id: '7',
      date: '2026-11-22T18:00:00',
      customer: 'cliente@seoulfood.cl',
      customerName: 'Cliente',
      status: 'Pendiente',
      statusCode: 'PENDIENTE',
      total: 7980,
      items: [{ id: '1', name: 'Nongshim Chapagetti', price: 3990, quantity: 2 }],
    });
  });

  it('getOrders deja las órdenes más recientes primero', async () => {
    loginAs('admin');
    mockFetch(200, [{ ...ORDEN_API, id: 1 }, { ...ORDEN_API, id: 2 }]);
    const lista = await getOrders();
    expect(lista.map((o) => o.id)).toEqual(['2', '1']);
  });

  it('sin órdenes devuelve una lista vacía', async () => {
    loginAs('admin');
    mockFetch(200, []);
    expect(await getOrders()).toEqual([]);
  });

  it('getOrderById trae el detalle de una orden', async () => {
    loginAs('vendedor');
    const fetchSpy = mockFetch(200, ORDEN_API);
    const orden = await getOrderById('7');
    expect(fetchSpy.calls.mostRecent().args[0]).toMatch(/\/ordenes\/7$/);
    expect(orden.total).toBe(7980);
  });

  it('getOrderById con una orden inexistente lanza el error del backend', async () => {
    loginAs('admin');
    mockFetch(404, { error: 'Orden no encontrada: 99' });
    try {
      await getOrderById('99');
      fail('debía lanzar un error');
    } catch (e) {
      expect(e.status).toBe(404);
      expect(e.message).toBe('Orden no encontrada: 99');
    }
  });

  it('createOrder envía solo producto y cantidad (el backend calcula el total)', async () => {
    loginAs('cliente');
    const fetchSpy = mockFetch(201, ORDEN_API);
    const orden = await createOrder([
      { product: { id: '1', name: 'Nongshim Chapagetti', price: 3990 }, quantity: 2 },
    ]);

    const [url, opciones] = fetchSpy.calls.mostRecent().args;
    expect(url).toMatch(/\/ordenes$/);
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual({ items: [{ productoId: 1, cantidad: 2 }] });
    expect(orden.id).toBe('7');
    expect(orden.status).toBe('Pendiente');
  });

  it('updateOrderStatus envía PUT con el nuevo estado y convierte la respuesta', async () => {
    loginAs('admin');
    const fetchSpy = mockFetch(200, { ...ORDEN_API, estado: 'ENTREGADA' });
    const orden = await updateOrderStatus('7', 'ENTREGADA');

    const [url, opciones] = fetchSpy.calls.mostRecent().args;
    expect(url).toMatch(/\/ordenes\/7\/estado$/);
    expect(opciones.method).toBe('PUT');
    expect(JSON.parse(opciones.body)).toEqual({ estado: 'ENTREGADA' });
    expect(orden.status).toBe('Entregada');
    expect(orden.statusCode).toBe('ENTREGADA');
  });
  
});