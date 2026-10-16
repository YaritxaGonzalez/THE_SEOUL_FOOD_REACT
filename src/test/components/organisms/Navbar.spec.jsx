import { screen } from '@testing-library/react';
import NavBar from '../../../components/organisms/Navbar';
import { renderApp, resetStorage, loginAs } from '../../test-utils';

describe('Navbar', () => {
  beforeEach(resetStorage);

  it('muestra el nombre de la tienda', () => {
    renderApp(<NavBar />);
    expect(screen.getByText('The Seoul Food')).toBeInTheDocument();
  });

  it('un visitante ve el botón del carrito', () => {
    renderApp(<NavBar />);
    expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument();
  });

  it('el administrador no ve el botón del carrito', () => {
    loginAs('admin');
    renderApp(<NavBar />);
    expect(screen.queryByLabelText('Abrir carrito')).not.toBeInTheDocument();
  });
});