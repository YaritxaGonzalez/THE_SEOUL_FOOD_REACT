import { render, screen } from '@testing-library/react';
import NeonHero from '../../../components/molecules/NeonHero';

describe('NeonHero', () => {
  it('muestra el título como h1 con la clase neon-title', () => {
    render(<NeonHero title="The Seoul Food" />);
    const titulo = screen.getByRole('heading', { level: 1, name: 'The Seoul Food' });
    expect(titulo).toHaveClass('neon-title');
  });

  it('muestra el subtítulo cuando se entrega', () => {
    render(<NeonHero title="Título" subtitle="Ramyeon coreano en Chile" />);
    expect(screen.getByText('Ramyeon coreano en Chile')).toHaveClass('neon-subtitle');
  });

  it('no renderiza el subtítulo cuando no se entrega', () => {
    const { container } = render(<NeonHero title="Solo título" />);
    expect(container.querySelector('.neon-subtitle')).toBeNull();
  });
});