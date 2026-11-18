import { render, screen, fireEvent } from '@testing-library/react';
import PlainButton from '../../../components/atoms/PlainButton';

describe('PlainButton', () => {
  it('es type="button" por defecto', () => {
    render(<PlainButton>Ir</PlainButton>);
    expect(screen.getByRole('button', { name: 'Ir' })).toHaveAttribute('type', 'button');
  });

  it('ejecuta onClick', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<PlainButton onClick={onClick}>Ir</PlainButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Ir' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});