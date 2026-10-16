import { render, screen } from '@testing-library/react';
import CardBody from '../../../components/molecules/CardBody';

describe('CardBody', () => {
  it('muestra el título como encabezado h5', () => {
    render(<CardBody title="Shin Ramyeon" price={3990} />);
    expect(screen.getByRole('heading', { level: 5, name: 'Shin Ramyeon' })).toBeInTheDocument();
  });

  it('muestra la descripción solo cuando se entrega', () => {
    const { rerender } = render(<CardBody title="Producto" price={1000} />);
    expect(screen.queryByText('Fideos picantes')).not.toBeInTheDocument();

    rerender(<CardBody title="Producto" description="Fideos picantes" price={1000} />);
    expect(screen.getByText('Fideos picantes')).toBeInTheDocument();
  });

  it('formatea el precio con separador de miles chileno', () => {
    render(<CardBody title="Producto" price={1250000} />);
    expect(screen.getByText('Precio:')).toBeInTheDocument();
    expect(screen.getByText('$1.250.000')).toBeInTheDocument();
  });
});