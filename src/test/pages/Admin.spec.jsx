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

  it('con datos válidos agrega el producto y muestra el mensaje', async () => {
    spyOn(window, 'fetch').and.resolveTo(
      new Response(
        JSON.stringify({
          id: 99, nombre: 'Kimchi Chips', descripcion: '', precio: 2500,
          stock: 5, categoria: 'Ramyeon', imagen: '/imagenes/chips.webp',
        }),
        { status: 201 }
      )
    );
    renderApp(<Admin />);
    abrirFormulario();
    escribir('Nombre del producto', 'Kimchi Chips');
    escribir('Ruta de la imagen (ej: /imagenes/nuevo.webp)', '/imagenes/chips.webp');
    escribir('Precio', '2500');
    escribir('Stock', '5');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    expect(await screen.findByText('Producto agregado')).toBeInTheDocument();
    expect(screen.getByText('Kimchi Chips')).toBeInTheDocument();
  });

  it('si el backend rechaza el producto muestra su mensaje de error', async () => {
    spyOn(window, 'fetch').and.resolveTo(
      new Response(JSON.stringify({ error: 'Ya existe un producto con ese nombre' }), { status: 409 })
    );
    renderApp(<Admin />);
    abrirFormulario();
    escribir('Nombre del producto', 'Nongshim Chapagetti');
    escribir('Ruta de la imagen (ej: /imagenes/nuevo.webp)', '/imagenes/a.webp');
    escribir('Precio', '1000');
    escribir('Stock', '5');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    expect(await screen.findByText('Ya existe un producto con ese nombre')).toBeInTheDocument();
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