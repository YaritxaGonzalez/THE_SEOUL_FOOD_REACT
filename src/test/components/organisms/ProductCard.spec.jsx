import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ProductCard from '../../../components/organisms/ProductCard';
import { renderApp, resetStorage } from '../../test-utils';

const producto = { id: '04', name: 'Shin Ramyeon', image: '/shin.webp', price: 3990, stock: 10 };

describe('ProductCard', () => {
  beforeEach(resetStorage);

  it('muestra el nombre del producto', () => {
    renderApp(<ProductCard product={producto} />);
    expect(screen.getByText('Shin Ramyeon')).toBeInTheDocument();
  });

  it('muestra la imagen del producto', () => {
    renderApp(<ProductCard product={producto} />);
    expect(screen.getByAltText('Shin Ramyeon')).toHaveAttribute('src', '/shin.webp');
  });

  it('al hacer clic en la imagen navega al detalle', () => {
    renderApp(
      <Routes>
        <Route path="/" element={<ProductCard product={producto} />} />
        <Route path="/products/:id" element={<p>Pantalla de detalle</p>} />
      </Routes>
    );
    fireEvent.click(screen.getByTitle('Ver detalles'));
    expect(screen.getByText('Pantalla de detalle')).toBeInTheDocument();
  });
});