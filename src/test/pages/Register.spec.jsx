import { screen, fireEvent } from '@testing-library/react';
import Register from '../../pages/Register';
import { renderApp, resetStorage, mockFetch } from '../test-utils';

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

function llenarFormulario({ correo = 'juan@correo.cl', pass = '12345678' } = {}) {
  escribir('Nombre de usuario', 'Juan Perez');
  escribir('Correo electrónico', correo);
  escribir('Teléfono', '912345678');
  escribir('Contraseña', pass);
  escribir('Confirmar contraseña', pass);
}

describe('Register', () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it('muestra el título, los campos y el botón Registrarse', () => {
    renderApp(<Register />, { route: '/register' });
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Teléfono')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });

  it('con un correo inválido muestra el error y no confirma el registro', () => {
    const fetchSpy = mockFetch(201, {});
    renderApp(<Register />, { route: '/register' });
    llenarFormulario({ correo: 'correo-malo' });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(screen.getByText('Ingresa un correo válido (ej: nombre@correo.com).')).toBeInTheDocument();
    expect(screen.queryByText(/Registro exitoso/)).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('con una contraseña de menos de 8 caracteres muestra el error', () => {
    renderApp(<Register />, { route: '/register' });
    llenarFormulario({ pass: '123456' });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
  });

  it('con datos válidos muestra el mensaje de registro exitoso', async () => {
    const fetchSpy = mockFetch(201, {
      accessToken: 'token',
      refreshToken: 'refresh',
      tipo: 'Bearer',
      nombre: 'Juan Perez',
      email: 'juan@correo.cl',
      rol: 'CLIENTE',
    });
    renderApp(<Register />, { route: '/register' });
    llenarFormulario();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(await screen.findByText(/Registro exitoso/)).toBeInTheDocument();

    // El teléfono se valida pero no se envía: el backend no lo guarda
    const body = JSON.parse(fetchSpy.calls.mostRecent().args[1].body);
    expect(body).toEqual({ nombre: 'Juan Perez', email: 'juan@correo.cl', password: '12345678' });
  });

  it('si el correo ya existe muestra el error del backend en el campo correo', async () => {
    mockFetch(409, { error: 'El email ya está registrado' });
    renderApp(<Register />, { route: '/register' });
    llenarFormulario();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(await screen.findByText('El email ya está registrado')).toBeInTheDocument();
    expect(screen.queryByText(/Registro exitoso/)).not.toBeInTheDocument();
  });
});