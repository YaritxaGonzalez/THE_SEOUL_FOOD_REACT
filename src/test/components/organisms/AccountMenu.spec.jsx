import { screen, fireEvent } from '@testing-library/react';
import AccountMenu from '../../../components/organisms/AccountMenu';
import { renderApp, resetStorage, loginAs } from '../../test-utils';

describe('AccountMenu', () => {
  beforeEach(resetStorage);

  it('sin sesión ofrece iniciar sesión y registrarse', () => {
    renderApp(<AccountMenu />);
    fireEvent.click(screen.getByText('👤 Cuenta'));
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  it('un cliente ve su correo y no ve el panel de administración', () => {
    loginAs('cliente');
    renderApp(<AccountMenu />);
    fireEvent.click(screen.getByText('👤 Mi cuenta'));
    expect(screen.getByText('cliente@correo.cl')).toBeInTheDocument();
    expect(screen.queryByText(/Panel de administración/)).not.toBeInTheDocument();
  });

  it('el administrador ve el enlace al panel de administración', () => {
    loginAs('admin');
    renderApp(<AccountMenu />);
    fireEvent.click(screen.getByText('👤 Mi cuenta'));
    expect(screen.getByText(/Panel de administración/)).toBeInTheDocument();
  });
});