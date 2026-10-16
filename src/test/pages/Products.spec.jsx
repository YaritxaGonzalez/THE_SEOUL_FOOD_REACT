import { screen } from '@testing-library/react';
import Products from '../../pages/Products';
import { renderApp, resetStorage, loginAs } from '../test-utils';

describe('Products', () => {
  beforeEach(resetStorage);

  it('muestra el título Productos', () => {
    renderApp(<Products />);
    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument();
  });

  it('muestra una tarjeta por cada producto del catálogo', () => {
    renderApp(<Products />);
    expect(screen.getAllByTitle('Ver detalles').length).toBe(16);
    expect(screen.getByText('Nongshim Shin Ramyeon')).toBeInTheDocument();
  });

  it('el administrador no ve los botones para agregar al carrito', () => {
    loginAs('admin');
    renderApp(<Products />);
    expect(screen.queryAllByRole('button', { name: 'Agregar' }).length).toBe(0);
  });
});