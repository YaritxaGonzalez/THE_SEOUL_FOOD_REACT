import { screen, fireEvent, within } from '@testing-library/react';
import ProductCarousel from '../../../components/organisms/ProductCarousel';
import { renderApp, resetStorage } from '../../test-utils';

describe('ProductCarousel', () => {
  beforeEach(resetStorage);

  it('muestra 6 slides por defecto', () => {
    const { container } = renderApp(<ProductCarousel />);
    expect(within(container).getAllByRole('link').length).toBe(6);
  });

  it('respeta el límite de slides indicado', () => {
    const { container } = renderApp(<ProductCarousel limit={3} />);
    expect(within(container).getAllByRole('link').length).toBe(3);
  });

  it('el botón Siguiente activa el siguiente slide', () => {
    const { container } = renderApp(<ProductCarousel />);
    const slides = within(container).getAllByRole('link');
    expect(slides[0]).toHaveClass('a');
    fireEvent.click(screen.getByLabelText('Siguiente'));
    expect(within(container).getAllByRole('link')[1]).toHaveClass('a');
  });
});