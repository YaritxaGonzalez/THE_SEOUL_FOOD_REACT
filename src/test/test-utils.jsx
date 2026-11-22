import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductsProvider } from '../context/ProductsContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { saveAuth } from '../services/api';
import productosPrueba from './fixtures/products';

const CORREOS = {
  admin: 'admin@seoulfood.cl',
  vendedor: 'vendedor@seoulfood.cl',
  cliente: 'cliente@correo.cl',
};

export function resetStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

// Simula una sesión iniciada ('admin', 'vendedor' o 'cliente'),
// guardada igual que la respuesta de POST /auth/login del backend
export function loginAs(rol) {
  saveAuth({
    accessToken: 'token-de-prueba',
    refreshToken: 'refresh-de-prueba',
    tipo: 'Bearer',
    nombre: rol,
    email: CORREOS[rol],
    rol: rol.toUpperCase(),
  });
}

// Simula la respuesta del backend (Jasmine restaura fetch solo al terminar cada test)
export function mockFetch(status, body) {
  return spyOn(window, 'fetch').and.callFake(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  );
}

// Deja un producto en el carrito guardado
export function seedCart(cart) {
  localStorage.setItem('seoulfood_carrito', JSON.stringify(cart));
}

// Renderiza con router y todos los providers de la app
export function renderApp(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ProductsProvider initialProducts={productosPrueba}>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </MemoryRouter>
  );
}