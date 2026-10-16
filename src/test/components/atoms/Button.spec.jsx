import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/atoms/Button';

describe('Button', () => {
  it('muestra el texto recibido como children', () => {
    render(<Button>Agregar</Button>);
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('ejecuta onClick al hacer clic', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Button onClick={onClick}>Clic</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Clic' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respeta las props de Bootstrap (variant y disabled)', () => {
    render(<Button variant="danger" disabled>Eliminar</Button>);
    const boton = screen.getByRole('button', { name: 'Eliminar' });
    expect(boton).toHaveClass('btn-danger');
    expect(boton).toBeDisabled();
  });
});