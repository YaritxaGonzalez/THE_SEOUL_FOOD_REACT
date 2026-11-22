import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import CartPanel from '../../../components/organisms/CartPanel';
import { renderApp, resetStorage, seedCart, loginAs } from '../../test-utils';

// Vencimiento siempre vigente (2 años a futuro)
const anioFuturo = String((new Date().getFullYear() + 2) % 100).padStart(2, '0');

const ORDEN_API = {
  id: 7,
  clienteNombre: 'cliente',
  clienteEmail: 'cliente@correo.cl',
  fecha: '2026-11-22T18:00:00',
  estado: 'PENDIENTE',
  total: 7980,
  detalles: [],
};

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

// POST /ordenes responde lo que se indique; GET /productos (el refresco) devuelve una lista vacía
function mockBackend(status, body) {
  return spyOn(window, 'fetch').and.callFake((url) => {
    const esOrden = String(url).includes('/ordenes');
    return Promise.resolve(
      new Response(JSON.stringify(esOrden ? body : []), {
        status: esOrden ? status : 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
}

function abrirPago() {
  loginAs('cliente'); // pagar exige sesión iniciada
  seedCart({ '01': 2 });
  renderApp(<CartPanel show={true} onHide={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Ir a pagar' }));
}

function llenarTarjeta(numero) {
  escribir('Nombre del titular', 'Juan Perez');
  escribir('Número de tarjeta (16 dígitos)', numero);
  escribir('MM/AA', `12/${anioFuturo}`);
  escribir('CVV', '123');
}

describe('CartPanel', () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it('con el carrito vacío avisa y deshabilita Ir a pagar', () => {
    renderApp(<CartPanel show={true} onHide={() => {}} />);
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir a pagar' })).toBeDisabled();
  });

  it('sin sesión avisa que hay que iniciar sesión y Ir a pagar lleva al login', () => {
    seedCart({ '01': 2 });
    renderApp(
      <Routes>
        <Route path="/" element={<CartPanel show={true} onHide={() => {}} />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    );
    expect(
      screen.getByText('Para continuar con el pago, primero debes iniciar sesión.')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ir a pagar' }));
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('con datos válidos crea la orden en el backend y muestra el éxito', async () => {
    const fetchSpy = mockBackend(201, ORDEN_API);
    abrirPago();
    llenarTarjeta('4111111111111111');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(await screen.findByText(/Transacción realizada con éxito/)).toBeInTheDocument();
    // El carrito queda vacío: no se puede volver a pagar
    expect(screen.getByRole('button', { name: 'Ir a pagar' })).toBeDisabled();

    // Se envió la orden con producto y cantidad
    const llamadaOrden = fetchSpy.calls.allArgs().find(([url]) => String(url).includes('/ordenes'));
    expect(JSON.parse(llamadaOrden[1].body)).toEqual({ items: [{ productoId: 1, cantidad: 2 }] });
  });

  it('si el backend rechaza por stock insuficiente muestra su mensaje y no confirma el pago', async () => {
    mockBackend(409, { error: "Stock insuficiente para 'Nongshim Chapagetti' (disponible: 1)" });
    abrirPago();
    llenarTarjeta('4111111111111111');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(
      await screen.findByText("Stock insuficiente para 'Nongshim Chapagetti' (disponible: 1)")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Transacción realizada con éxito/)).not.toBeInTheDocument();
  });

  it('con una tarjeta inventada muestra error y no llama al backend', () => {
    const fetchSpy = mockBackend(201, ORDEN_API);
    abrirPago();
    llenarTarjeta('1234567890123456');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(screen.getByText('Número de tarjeta inválido')).toBeInTheDocument();
    expect(screen.queryByText(/Transacción realizada con éxito/)).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});