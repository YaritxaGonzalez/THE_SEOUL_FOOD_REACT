import { render, screen } from '@testing-library/react';
import Text from '../../../components/atoms/Text';

describe('Text', () => {
  it('por defecto renderiza un párrafo <p>', () => {
    render(<Text>Hola mundo</Text>);
    const texto = screen.getByText('Hola mundo');
    expect(texto.tagName).toBe('P');
  });

  it('renderiza la etiqueta indicada en variant', () => {
    render(<Text variant="h2">Título</Text>);
    expect(screen.getByRole('heading', { level: 2, name: 'Título' })).toBeInTheDocument();
  });

  it('aplica la clase CSS recibida', () => {
    render(<Text className="neon-title">Con clase</Text>);
    expect(screen.getByText('Con clase')).toHaveClass('neon-title');
  });
});