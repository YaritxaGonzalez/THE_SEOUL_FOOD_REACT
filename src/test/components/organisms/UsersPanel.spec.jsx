import { screen, fireEvent } from '@testing-library/react';
import UsersPanel from '../../../components/organisms/UsersPanel';
import { renderApp, resetStorage, loginAs } from '../../test-utils';

const ADMIN = { id: 1, nombre: 'Administrador', email: 'admin@seoulfood.cl', rol: 'ADMIN', activo: true };
const VENDEDOR = { id: 2, nombre: 'Vendedor', email: 'vendedor@seoulfood.cl', rol: 'VENDEDOR', activo: true };

function respuesta(status, body) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

// Simula la API de usuarios del backend
function mockBackend() {
  return spyOn(window, 'fetch').and.callFake((url, opciones) => {
    const metodo = opciones?.method ?? 'GET';
    const ruta = String(url);
    if (metodo === 'GET') return respuesta(200, [ADMIN, VENDEDOR]);
    if (metodo === 'POST') {
      return respuesta(201, {
        id: 3, nombre: 'Nueva Persona', email: 'nueva@seoulfood.cl', rol: 'VENDEDOR', activo: true,
      });
    }
    if (ruta.includes('/rol')) return respuesta(200, { ...VENDEDOR, rol: 'CLIENTE' });
    if (ruta.includes('/activo')) return respuesta(200, { ...VENDEDOR, activo: false });
    return respuesta(404, { error: 'Ruta no simulada' });
  });
}

function llamadasDe(fetchSpy, metodo) {
  return fetchSpy.calls.allArgs().filter(([, op]) => (op?.method ?? 'GET') === metodo);
}

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

describe('UsersPanel', () => {
  beforeEach(() => {
    resetStorage();
    loginAs('admin');
  });
  afterEach(resetStorage);

  it('lista los usuarios y bloquea los controles de la propia cuenta', async () => {
    mockBackend();
    renderApp(<UsersPanel />);
    expect(await screen.findByText('vendedor@seoulfood.cl')).toBeInTheDocument();

    expect(screen.getByLabelText('Rol de admin@seoulfood.cl')).toBeDisabled();
    expect(screen.getByLabelText('Rol de vendedor@seoulfood.cl')).not.toBeDisabled();

    const [desactivarPropio, desactivarOtro] = screen.getAllByRole('button', { name: 'Desactivar' });
    expect(desactivarPropio).toBeDisabled();
    expect(desactivarOtro).not.toBeDisabled();
  });

  it('cambia el rol de otro usuario', async () => {
    const fetchSpy = mockBackend();
    renderApp(<UsersPanel />);
    await screen.findByText('vendedor@seoulfood.cl');

    fireEvent.change(screen.getByLabelText('Rol de vendedor@seoulfood.cl'), {
      target: { value: 'CLIENTE' },
    });
    expect(await screen.findByText('Rol actualizado')).toBeInTheDocument();

    const [url, opciones] = llamadasDe(fetchSpy, 'PUT')[0];
    expect(url).toMatch(/\/usuarios\/2\/rol$/);
    expect(JSON.parse(opciones.body)).toEqual({ rol: 'CLIENTE' });
  });

  it('desactiva a otro usuario', async () => {
    const fetchSpy = mockBackend();
    renderApp(<UsersPanel />);
    await screen.findByText('vendedor@seoulfood.cl');

    fireEvent.click(screen.getAllByRole('button', { name: 'Desactivar' })[1]);
    expect(await screen.findByText('Usuario desactivado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Activar' })).toBeInTheDocument();
    expect(llamadasDe(fetchSpy, 'PUT')[0][0]).toMatch(/\/usuarios\/2\/activo\?valor=false$/);
  });

  it('crea un usuario con el rol elegido', async () => {
    const fetchSpy = mockBackend();
    renderApp(<UsersPanel />);
    await screen.findByText('vendedor@seoulfood.cl');

    escribir('Nombre', 'Nueva Persona');
    escribir('Correo electrónico', 'nueva@seoulfood.cl');
    escribir('Contraseña (mínimo 8 caracteres)', '12345678');
    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(await screen.findByText('Usuario creado')).toBeInTheDocument();
    expect(screen.getByText('nueva@seoulfood.cl')).toBeInTheDocument();
    expect(JSON.parse(llamadasDe(fetchSpy, 'POST')[0][1].body)).toEqual({
      nombre: 'Nueva Persona',
      email: 'nueva@seoulfood.cl',
      password: '12345678',
      rol: 'VENDEDOR',
    });
  });

  it('con una contraseña corta muestra el error y no llama al backend', async () => {
    const fetchSpy = mockBackend();
    renderApp(<UsersPanel />);
    await screen.findByText('vendedor@seoulfood.cl');

    escribir('Nombre', 'Nueva Persona');
    escribir('Correo electrónico', 'nueva@seoulfood.cl');
    escribir('Contraseña (mínimo 8 caracteres)', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    expect(llamadasDe(fetchSpy, 'POST').length).toBe(0);
  });
});