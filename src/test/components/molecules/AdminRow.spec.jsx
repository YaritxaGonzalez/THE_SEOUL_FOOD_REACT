import { render, screen, fireEvent } from '@testing-library/react';
import AdminRow from '../../../components/molecules/AdminRow';

const producto = { id: '01', name: 'Shin Ramyeon', image: '/a.png', price: 3990, stock: 10 };

// AdminRow es una fila <tr>, por eso se renderiza dentro de una tabla
function renderFila(props = {}) {
  const onSave = jasmine.createSpy('onSave');
  const onDelete = jasmine.createSpy('onDelete');
  render(
    <table>
      <tbody>
        <AdminRow product={producto} onSave={onSave} onDelete={onDelete} {...props} />
      </tbody>
    </table>
  );
  return { onSave, onDelete };
}

describe('AdminRow', () => {
  it('muestra el nombre, el precio y el stock del producto', () => {
    renderFila();
    const [precio, stock] = screen.getAllByRole('spinbutton');
    expect(screen.getByText('Shin Ramyeon')).toBeInTheDocument();
    expect(precio).toHaveValue(3990);
    expect(stock).toHaveValue(10);
  });

  it('llama a onSave con el precio editado', () => {
    const { onSave } = renderFila();
    const [precio] = screen.getAllByRole('spinbutton');
    fireEvent.change(precio, { target: { value: '5000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSave).toHaveBeenCalledWith('01', '5000', 10);
  });

  it('deshabilita Guardar si el precio es negativo', () => {
    renderFila();
    const [precio] = screen.getAllByRole('spinbutton');
    fireEvent.change(precio, { target: { value: '-5' } });
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });
});