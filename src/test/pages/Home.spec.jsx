import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import { renderApp, resetStorage } from '../test-utils';

describe('Home', () => {
  beforeEach(resetStorage);

  it('muestra el título y el subtítulo de la tienda', () => {
    renderApp(<Home />);
    expect(screen.getByRole('heading', { name: 'The Seoul Food' })).toBeInTheDocument();
    expect(
      screen.getByText('Los mejores ramyeon y snacks coreanos, directo a tu puerta.')
    ).toBeInTheDocument();
  });

  it('incluye el carrusel con 6 productos', () => {
    renderApp(<Home />);
    expect(screen.getAllByRole('link').length).toBe(6);
  });

  it('el botón Ver productos navega a la pantalla de productos', () => {
    renderApp(
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<p>Pantalla de productos</p>} />
      </Routes>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ver productos' }));
    expect(screen.getByText('Pantalla de productos')).toBeInTheDocument();
  });
});