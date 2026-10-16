import { screen, fireEvent } from '@testing-library/react';
import CartPanel from '../../../components/organisms/CartPanel';
import { renderApp, resetStorage, seedCart } from '../../test-utils';

// Vencimiento siempre vigente (2 años a futuro)
const anioFuturo = String((new Date().getFullYear() + 2) % 100).padStart(2, '0');

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

function abrirPago() {
  seedCart({ '01': 2 });
  renderApp(<CartPanel show={true} onHide={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Ir a pagar' }));
}

describe('CartPanel', () => {
  beforeEach(resetStorage);

  it('con el carrito vacío avisa y deshabilita Ir a pagar', () => {
    renderApp(<CartPanel show={true} onHide={() => {}} />);
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir a pagar' })).toBeDisabled();
  });

  it('con datos válidos muestra el mensaje de transacción exitosa', () => {
    abrirPago();
    escribir('Nombre del titular', 'Juan Perez');
    escribir('Número de tarjeta (16 dígitos)', '4111111111111111');
    escribir('MM/AA', `12/${anioFuturo}`);
    escribir('CVV', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(screen.getByText(/Transacción realizada con éxito/)).toBeInTheDocument();
    // El carrito queda vacío: no se puede volver a pagar
    expect(screen.getByRole('button', { name: 'Ir a pagar' })).toBeDisabled();
  });

  it('con una tarjeta inventada muestra error y no confirma el pago', () => {
    abrirPago();
    escribir('Nombre del titular', 'Juan Perez');
    escribir('Número de tarjeta (16 dígitos)', '1234567890123456');
    escribir('MM/AA', `12/${anioFuturo}`);
    escribir('CVV', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(screen.getByText('Número de tarjeta inválido')).toBeInTheDocument();
    expect(screen.queryByText(/Transacción realizada con éxito/)).not.toBeInTheDocument();
  });
});