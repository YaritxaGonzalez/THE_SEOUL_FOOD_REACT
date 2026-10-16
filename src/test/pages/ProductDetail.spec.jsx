import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from '../../pages/ProductDetail';
import { renderApp, resetStorage } from '../test-utils';

// ProductDetail lee el id desde la URL, por eso necesita una ruta con :id
function renderDetalle(id) {
  renderApp(
    <Routes>
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>,
    { route: `/products/${id}` }
  );
}

describe('ProductDetail', () => {
  beforeEach(resetStorage);

  it('muestra el nombre, la descripción y el precio del producto', () => {
    renderDetalle('04');
    expect(screen.getByRole('heading', { name: 'Nongshim Shin Ramyeon' })).toBeInTheDocument();
    expect(screen.getByText('El ramyeon picante más icónico de Corea.')).toBeInTheDocument();
    expect(screen.getByText(/3\.990/)).toBeInTheDocument();
  });

  it('con un id que no existe avisa que el producto no fue encontrado', () => {
    renderDetalle('999');
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a productos' })).toBeInTheDocument();
  });

  it('al presionar Agregar muestra la cantidad 1', () => {
    renderDetalle('04');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(
      screen.getByRole('group', { name: 'Cantidad de Nongshim Shin Ramyeon' })
    ).toHaveTextContent('1');
  });
});