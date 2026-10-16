import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../../../components/templates/MainLayout';
import { renderApp, resetStorage } from '../../test-utils';

function renderLayout() {
  renderApp(
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<p>Contenido de la página</p>} />
      </Route>
    </Routes>
  );
}

describe('MainLayout', () => {
  beforeEach(resetStorage);

  it('muestra el contenido de la página dentro del layout', () => {
    renderLayout();
    expect(screen.getByText('Contenido de la página')).toBeInTheDocument();
  });

  it('incluye la barra de navegación', () => {
    renderLayout();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('incluye el pie de página', () => {
    renderLayout();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});