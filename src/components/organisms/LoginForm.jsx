import { Form } from 'react-bootstrap';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

function LoginForm({ form, onChange, onSubmit, onGuest }) {
  return (
    <Form onSubmit={onSubmit}>
      <Input
        className="mb-3"
        type="email"
        name="correo"
        placeholder="Correo electrónico"
        value={form.correo}
        onChange={onChange}
        required
      />
      <Input
        className="mb-3"
        type="password"
        name="pass"
        placeholder="Contraseña"
        value={form.pass}
        onChange={onChange}
        required
      />
      <Button type="submit" variant="primary" className="w-100 mb-2">
        Ingresar
      </Button>
      <Button variant="outline-secondary" className="w-100" onClick={onGuest}>
        Continuar sin iniciar sesión
      </Button>
    </Form>
  );
}

export default LoginForm;