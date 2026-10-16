import { render, screen } from '@testing-library/react';
import Image from '../../../components/atoms/Image';

describe('Image', () => {
  it('renderiza una imagen con el src indicado', () => {
    render(<Image src="/imagenes/ramyeon.webp" alt="Ramyeon" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/imagenes/ramyeon.webp');
  });

  it('usa el alt como texto alternativo accesible', () => {
    render(<Image src="/a.png" alt="Logo The Seoul Food" />);
    expect(screen.getByAltText('Logo The Seoul Food')).toBeInTheDocument();
  });

  it('aplica la clase CSS recibida', () => {
    render(<Image src="/a.png" alt="Producto" className="product-img" />);
    expect(screen.getByAltText('Producto')).toHaveClass('product-img');
  });
});