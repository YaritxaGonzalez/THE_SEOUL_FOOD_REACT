import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Login from '../../pages/Login';
import { renderApp, resetStorage, mockFetch } from '../test-utils';

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

describe('Login', () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it('muestra el título, los campos y el botón Ingresar', () => {
    renderApp(<Login />, { route: '/login' });
    expect(screen.getByRole('heading', { name: 'The Seoul Food' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('con credenciales incorrectas muestra el mensaje del backend', async () => {
    mockFetch(401, { error: 'Credenciales inválidas o usuario inactivo' });
    renderApp(<Login />, { route: '/login' });
    escribir('Correo electrónico', 'nadie@correo.cl');
    escribir('Contraseña', 'claveMala');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(
      await screen.findByText('Credenciales inválidas o usuario inactivo')
    ).toBeInTheDocument();
  });

  it('si el servidor no responde muestra un error de conexión', async () => {
    spyOn(window, 'fetch').and.callFake(() => Promise.reject(new TypeError('Failed to fetch')));
    renderApp(<Login />, { route: '/login' });
    escribir('Correo electrónico', 'cliente@correo.cl');
    escribir('Contraseña', 'cualquierClave');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('No se pudo conectar con el servidor')).toBeInTheDocument();
  });

  it('el administrador inicia sesión y es enviado al panel', async () => {
    mockFetch(200, {
      accessToken: 'token',
      refreshToken: 'refresh',
      tipo: 'Bearer',
      nombre: 'Administrador',
      email: 'admin@seoulfood.cl',
      rol: 'ADMIN',
    });
    renderApp(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<p>Pantalla del panel</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>,
      { route: '/login' }
    );
    escribir('Correo electrónico', 'admin@seoulfood.cl');
    escribir('Contraseña', 'cualquierClave1');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Pantalla del panel')).toBeInTheDocument();
  });

  it('el vendedor inicia sesión y es enviado a las órdenes', async () => {
    mockFetch(200, {
      accessToken: 'token',
      refreshToken: 'refresh',
      tipo: 'Bearer',
      nombre: 'Vendedor',
      email: 'vendedor@seoulfood.cl',
      rol: 'VENDEDOR',
    });
    renderApp(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<p>Pantalla de órdenes</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>,
      { route: '/login' }
    );
    escribir('Correo electrónico', 'vendedor@seoulfood.cl');
    escribir('Contraseña', 'cualquierClave1');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Pantalla de órdenes')).toBeInTheDocument();
  });
});