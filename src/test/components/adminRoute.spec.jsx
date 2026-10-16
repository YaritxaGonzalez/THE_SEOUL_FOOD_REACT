import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import AdminRoute from '../../components/adminRoute';
import { renderApp, resetStorage, loginAs } from '../test-utils';

const rutas = (
  <Routes>
    <Route path="/" element={<p>Página de inicio</p>} />
    <Route path="/admin" element={<AdminRoute><p>Panel secreto</p></AdminRoute>} />
  </Routes>
);

describe('AdminRoute', () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it('muestra el contenido cuando el usuario es admin', () => {
    loginAs('admin');
    renderApp(rutas, { route: '/admin' });
    expect(screen.getByText('Panel secreto')).toBeInTheDocument();
  });

  it('redirige al inicio cuando el usuario es cliente', () => {
    loginAs('cliente');
    renderApp(rutas, { route: '/admin' });
    expect(screen.queryByText('Panel secreto')).not.toBeInTheDocument();
    expect(screen.getByText('Página de inicio')).toBeInTheDocument();
  });

  it('redirige al inicio cuando no hay sesión iniciada', () => {
    renderApp(rutas, { route: '/admin' });
    expect(screen.queryByText('Panel secreto')).not.toBeInTheDocument();
    expect(screen.getByText('Página de inicio')).toBeInTheDocument();
  });
});