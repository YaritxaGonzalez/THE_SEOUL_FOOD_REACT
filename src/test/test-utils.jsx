import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductsProvider } from '../context/ProductsContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const CORREOS = {
  admin: 'admin@theseoulfood.cl',
  vendedor: 'vendedor@theseoulfood.cl',
  cliente: 'cliente@correo.cl',
};

export function resetStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

// Simula una sesión iniciada ('admin' o 'cliente')
export function loginAs(rol) {
  sessionStorage.setItem('rolActual', rol);
  sessionStorage.setItem('userActual', CORREOS[rol]);
  sessionStorage.setItem('nombreActual', rol);
}

// Deja un producto en el carrito guardado
export function seedCart(cart) {
  localStorage.setItem('seoulfood_carrito', JSON.stringify(cart));
}

// Renderiza con router y todos los providers de la app
export function renderApp(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ProductsProvider>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </MemoryRouter>
  );
}