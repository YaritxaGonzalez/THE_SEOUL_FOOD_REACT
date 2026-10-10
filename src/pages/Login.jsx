import { useState } from 'react';
import { Container, Card, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import { login } from '../utils/auth';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', pass: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(form.correo.trim().toLowerCase(), form.pass);
    if (!user) {
      setError('Usuario o contraseña incorrectos');
      return;
    }
    setError('');
    navigate(user.rol === 'admin' ? '/admin' : '/');
  };

  return (
    <Container className="my-5">
      <Card style={{ maxWidth: '26rem' }} className="mx-auto p-4">
        <h1 className="h3">Inicio de sesión</h1>
        <p>Inicia sesión para comprar tus productos favoritos.</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="pass"
              placeholder="Contraseña"
              value={form.pass}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100 mb-2">
            Iniciar sesión
          </Button>
          <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </Form>

        <p className="mt-3 mb-0">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Login;