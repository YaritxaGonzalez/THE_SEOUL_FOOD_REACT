import { render, screen } from '@testing-library/react';
import Input from '../../../components/atoms/Input';

describe('Input', () => {
  it('muestra el mensaje de error cuando recibe error', () => {
    render(<Input name="correo" placeholder="Correo" error="Correo inválido" />);
    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo')).toHaveClass('is-invalid');
  });

  it('no muestra error si no se envía', () => {
    render(<Input name="correo" placeholder="Correo" />);
    expect(screen.getByPlaceholderText('Correo')).not.toHaveClass('is-invalid');
  });
});