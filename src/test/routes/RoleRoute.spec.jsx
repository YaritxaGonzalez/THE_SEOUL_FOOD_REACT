import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import RoleRoute from '../../routes/RoleRoute';
import { renderApp, resetStorage, loginAs } from '../test-utils';

const rutas = (
  <Routes>
    <Route path="/" element={<p>Página de inicio</p>} />
    <Route
      path="/orders"
      element={<RoleRoute roles={['admin', 'vendedor']}><p>Lista de órdenes</p></RoleRoute>}
    />
  </Routes>
);

describe('RoleRoute', () => {
  beforeEach(resetStorage);

  it('deja pasar al vendedor', () => {
    loginAs('vendedor');
    renderApp(rutas, { route: '/orders' });
    expect(screen.getByText('Lista de órdenes')).toBeInTheDocument();
  });

  it('deja pasar al administrador', () => {
    loginAs('admin');
    renderApp(rutas, { route: '/orders' });
    expect(screen.getByText('Lista de órdenes')).toBeInTheDocument();
  });

  it('redirige al cliente al inicio', () => {
    loginAs('cliente');
    renderApp(rutas, { route: '/orders' });
    expect(screen.getByText('Página de inicio')).toBeInTheDocument();
  });

  it('redirige al visitante sin sesión', () => {
    renderApp(rutas, { route: '/orders' });
    expect(screen.getByText('Página de inicio')).toBeInTheDocument();
  });
});