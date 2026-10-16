import { render, act } from '@testing-library/react';
import MatrixBackground from '../../../components/organisms/MatrixBackground';

const cantidadEsperada = () =>
  (Math.ceil(window.innerWidth / 40) + 2) * (Math.ceil(window.innerHeight / 40) + 2);

describe('MatrixBackground', () => {
  it('es decorativo: el contenedor tiene aria-hidden="true"', () => {
    const { container } = render(<MatrixBackground />);
    expect(container.querySelector('.jp-matrix')).toHaveAttribute('aria-hidden', 'true');
  });

  it('genera un carácter coreano por cada celda de la pantalla', () => {
    const { container } = render(<MatrixBackground />);
    const spans = container.querySelectorAll('.jp-matrix span');
    expect(spans.length).toBe(cantidadEsperada());
    spans.forEach((s) => expect(s.textContent).toMatch(/^[가-힣]$/));
  });

  describe('al cambiar el tamaño de la ventana', () => {
    const anchoOriginal = window.innerWidth;

    beforeEach(() => jasmine.clock().install());
    afterEach(() => {
      jasmine.clock().uninstall();
      window.innerWidth = anchoOriginal;
    });

    it('regenera la cantidad de caracteres (con debounce de 150 ms)', () => {
      window.innerWidth = 400;
      const { container } = render(<MatrixBackground />);
      const antes = container.querySelectorAll('.jp-matrix span').length;

      window.innerWidth = 1200;
      window.dispatchEvent(new Event('resize'));
      // Antes de los 150 ms todavía no cambia
      expect(container.querySelectorAll('.jp-matrix span').length).toBe(antes);

      act(() => jasmine.clock().tick(150));
      const despues = container.querySelectorAll('.jp-matrix span').length;
      expect(despues).toBe(cantidadEsperada());
      expect(despues).toBeGreaterThan(antes);
    });
  });
});