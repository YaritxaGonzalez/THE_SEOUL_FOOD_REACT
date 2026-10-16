import { screen, fireEvent } from '@testing-library/react';
import Register from '../../pages/Register';
import { renderApp, resetStorage } from '../test-utils';

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

describe('Register', () => {
  beforeEach(resetStorage);

  it('muestra el título, los campos y el botón Registrarse', () => {
    renderApp(<Register />, { route: '/register' });
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });

  it('con un correo inválido muestra el error y no confirma el registro', () => {
    renderApp(<Register />, { route: '/register' });
    escribir('Nombre de usuario', 'Juan Perez');
    escribir('Correo electrónico', 'correo-malo');
    escribir('Teléfono', '912345678');
    escribir('Contraseña', '123456');
    escribir('Confirmar contraseña', '123456');
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(screen.getByText('Ingresa un correo válido (ej: nombre@correo.com).')).toBeInTheDocument();
    expect(screen.queryByText(/Registro exitoso/)).not.toBeInTheDocument();
  });

  it('con datos válidos muestra el mensaje de registro exitoso', () => {
    renderApp(<Register />, { route: '/register' });
    escribir('Nombre de usuario', 'Juan Perez');
    escribir('Correo electrónico', 'juan@correo.cl');
    escribir('Teléfono', '912345678');
    escribir('Contraseña', '123456');
    escribir('Confirmar contraseña', '123456');
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(screen.getByText(/Registro exitoso/)).toBeInTheDocument();
  });
});