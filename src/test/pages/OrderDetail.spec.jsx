import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import OrderDetail from '../../pages/OrderDetail';
import { renderApp, resetStorage, loginAs } from '../test-utils';

const ORDEN_API = {
  id: 7,
  clienteNombre: 'Cliente',
  clienteEmail: 'cliente@seoulfood.cl',
  fecha: '2026-11-22T18:00:00',
  estado: 'PENDIENTE',
  total: 7980,
  detalles: [
    { productoId: 1, producto: 'Nongshim Chapagetti', cantidad: 2, precioUnitario: 3990, subtotal: 7980 },
  ],
};

function respuesta(status, body) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

// GET /ordenes/7 devuelve la orden; PUT /ordenes/7/estado responde lo que se indique;
// GET /productos (el refresco al cancelar) devuelve una lista vacía
function mockBackend({ estadoStatus = 200, estadoBody } = {}) {
  return spyOn(window, 'fetch').and.callFake((url, opciones) => {
    const ruta = String(url);
    if (ruta.includes('/productos')) return respuesta(200, []);
    if (opciones?.method === 'PUT') {
      const { estado } = JSON.parse(opciones.body);
      return respuesta(estadoStatus, estadoBody ?? { ...ORDEN_API, estado });
    }
    return respuesta(200, ORDEN_API);
  });
}

function renderDetalle() {
  renderApp(
    <Routes>
      <Route path="/orders/:id" element={<OrderDetail />} />
    </Routes>,
    { route: '/orders/7' }
  );
}

describe('OrderDetail', () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it('el administrador cambia el estado de la orden', async () => {
    loginAs('admin');
    const fetchSpy = mockBackend();
    renderDetalle();
    expect(await screen.findByText('Estado: Pendiente')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nuevo estado'), { target: { value: 'ENTREGADA' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByText('Estado: Entregada')).toBeInTheDocument();
    expect(screen.getByText('Estado actualizado')).toBeInTheDocument();

    const put = fetchSpy.calls.allArgs().find(([, op]) => op?.method === 'PUT');
    expect(put[0]).toMatch(/\/ordenes\/7\/estado$/);
    expect(JSON.parse(put[1].body)).toEqual({ estado: 'ENTREGADA' });
  });

  it('al cancelar pide confirmación y deja de permitir cambios', async () => {
    loginAs('admin');
    mockBackend();
    spyOn(window, 'confirm').and.returnValue(true);
    renderDetalle();
    await screen.findByText('Estado: Pendiente');

    fireEvent.change(screen.getByLabelText('Nuevo estado'), { target: { value: 'CANCELADA' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByText('Estado: Cancelada')).toBeInTheDocument();
    expect(
      screen.getByText('Una orden cancelada no puede cambiar de estado.')
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Nuevo estado')).not.toBeInTheDocument();
  });

  it('si el administrador no confirma la cancelación no se llama al backend', async () => {
    loginAs('admin');
    const fetchSpy = mockBackend();
    spyOn(window, 'confirm').and.returnValue(false);
    renderDetalle();
    await screen.findByText('Estado: Pendiente');

    fireEvent.change(screen.getByLabelText('Nuevo estado'), { target: { value: 'CANCELADA' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(screen.getByText('Estado: Pendiente')).toBeInTheDocument();
    expect(fetchSpy.calls.allArgs().some(([, op]) => op?.method === 'PUT')).toBe(false);
  });

  it('el vendedor ve la orden pero no puede cambiar su estado', async () => {
    loginAs('vendedor');
    mockBackend();
    renderDetalle();
    expect(await screen.findByText('Estado: Pendiente')).toBeInTheDocument();
    expect(screen.queryByLabelText('Nuevo estado')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Actualizar estado' })).not.toBeInTheDocument();
  });

  it('si el backend rechaza el cambio muestra su mensaje', async () => {
    loginAs('admin');
    mockBackend({ estadoStatus: 409, estadoBody: { error: 'Una orden cancelada no puede cambiar de estado' } });
    renderDetalle();
    await screen.findByText('Estado: Pendiente');

    fireEvent.change(screen.getByLabelText('Nuevo estado'), { target: { value: 'PAGADA' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(
      await screen.findByText('Una orden cancelada no puede cambiar de estado')
    ).toBeInTheDocument();
    expect(screen.getByText('Estado: Pendiente')).toBeInTheDocument();
  });
});