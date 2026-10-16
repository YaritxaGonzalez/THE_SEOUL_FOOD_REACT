import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Login from '../../pages/Login';
import { renderApp, resetStorage } from '../test-utils';

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

describe('Login', () => {
  beforeEach(resetStorage);

  it('muestra el título, los campos y el botón Ingresar', () => {
    renderApp(<Login />, { route: '/login' });
    expect(screen.getByRole('heading', { name: 'The Seoul Food' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('con credenciales incorrectas muestra un mensaje de error', () => {
    renderApp(<Login />, { route: '/login' });
    escribir('Correo electrónico', 'nadie@correo.cl');
    escribir('Contraseña', 'claveMala');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
  });

  it('el administrador inicia sesión y es enviado al panel', () => {
    renderApp(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<p>Pantalla del panel</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>,
      { route: '/login' }
    );
    escribir('Correo electrónico', 'admin@theseoulfood.cl');
    escribir('Contraseña', 'SoulFood2026Adm!');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByText('Pantalla del panel')).toBeInTheDocument();
  });
});