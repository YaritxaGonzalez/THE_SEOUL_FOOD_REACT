import { Form } from 'react-bootstrap';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const FIELDS = [
  { name: 'nombre', type: 'text', placeholder: 'Nombre de usuario' },
  { name: 'correo', type: 'email', placeholder: 'Correo electrónico' },
  { name: 'telefono', type: 'tel', placeholder: 'Teléfono' },
  { name: 'pass', type: 'password', placeholder: 'Contraseña' },
  { name: 'confirmarPass', type: 'password', placeholder: 'Confirmar contraseña' },
];

function RegisterForm({ form, errors, success, loading, onChange, onSubmit, onBackToLogin, onGuest }) {
  return (
    <Form onSubmit={onSubmit} noValidate>
      {FIELDS.map(({ name, type, placeholder }) => (
        <Input
          key={name}
          className="mb-3"
          type={type}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={onChange}
          error={errors[name]}
          required
        />
      ))}

      <Button type="submit" variant="primary" className="w-100 mb-2" disabled={success || loading}>
        {loading ? 'Registrando…' : 'Registrarse'}
      </Button>
      <Button variant="outline-secondary" className="w-100 mb-2" onClick={onBackToLogin}>
        Volver al inicio de sesión
      </Button>
      <Button variant="link" className="w-100" onClick={onGuest}>
        Continuar sin registrarme
      </Button>
    </Form>
  );
}

export default RegisterForm;