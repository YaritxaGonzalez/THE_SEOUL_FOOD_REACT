import { render, screen } from '@testing-library/react';
import Footer from '../../../components/organisms/Footer';

describe('Footer', () => {
  it('muestra el logo con su texto alternativo', () => {
    render(<Footer />);
    const logo = screen.getByAltText('Logo The Seoul Food');
    expect(logo).toHaveAttribute('src', '/imagenes/store-front.png');
  });

  it('muestra el correo de contacto y los envíos a todo Chile', () => {
    render(<Footer />);
    expect(screen.getByText(/contacto@theseoulfood\.cl/)).toBeInTheDocument();
    expect(screen.getByText(/Envíos a todo Chile/)).toBeInTheDocument();
  });

  it('tiene el id "footer" y muestra los derechos reservados', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer#footer')).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument();
  });
});