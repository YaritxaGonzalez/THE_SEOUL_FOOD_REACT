import { screen, fireEvent } from '@testing-library/react';
import Admin from '../../pages/Admin';
import { renderApp, resetStorage } from '../test-utils';

function escribir(placeholder, valor) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });
}

// El formulario está en la pestaña "Producto"
function abrirFormulario() {
  fireEvent.click(screen.getByRole('tab', { name: 'Producto' }));
}

describe('Admin', () => {
  beforeEach(resetStorage);

  it('muestra el título y la tabla con todos los productos', () => {
    renderApp(<Admin />);
    expect(screen.getByText('Panel de administración')).toBeInTheDocument();
    expect(screen.getByText('Nongshim Chapagetti')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Guardar' }).length).toBe(16);
  });

  it('con datos válidos agrega el producto y muestra el mensaje', () => {
    renderApp(<Admin />);
    abrirFormulario();
    escribir('Nombre del producto', 'Kimchi Chips');
    escribir('Ruta de la imagen (ej: /imagenes/nuevo.webp)', '/imagenes/chips.webp');
    escribir('Precio', '2500');
    escribir('Stock', '5');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    expect(screen.getByText('Producto agregado')).toBeInTheDocument();
    expect(screen.getByText('Kimchi Chips')).toBeInTheDocument();
  });

  it('con un nombre de 1 letra muestra error y no agrega el producto', () => {
    renderApp(<Admin />);
    abrirFormulario();
    escribir('Nombre del producto', 'A');
    escribir('Ruta de la imagen (ej: /imagenes/nuevo.webp)', '/imagenes/a.webp');
    escribir('Precio', '1000');
    escribir('Stock', '5');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    expect(
      screen.getByText('El nombre del producto debe tener al menos 2 caracteres.')
    ).toBeInTheDocument();
    expect(screen.queryByText('Producto agregado')).not.toBeInTheDocument();
  });
});