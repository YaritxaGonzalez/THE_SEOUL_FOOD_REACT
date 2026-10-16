import { screen, fireEvent } from '@testing-library/react';
import QuantityControl from '../../../components/molecules/QuantityControl';
import { renderApp, resetStorage } from '../../test-utils';

const conStock = { id: '01', name: 'Chapagetti', price: 3990, stock: 10 };
const sinStock = { id: '16', name: 'Suegogui', price: 3990, stock: 0 };

describe('QuantityControl', () => {
  beforeEach(resetStorage);

  it('muestra el botón Agregar si el producto no está en el carrito', () => {
    renderApp(<QuantityControl product={conStock} />);
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('muestra "Sin stock" deshabilitado cuando no hay unidades', () => {
    renderApp(<QuantityControl product={sinStock} />);
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
  });

  it('al presionar Agregar muestra la cantidad 1', () => {
    renderApp(<QuantityControl product={conStock} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(screen.getByRole('group', { name: 'Cantidad de Chapagetti' })).toHaveTextContent('1');
  });
});