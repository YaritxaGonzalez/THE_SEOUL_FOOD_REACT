import { useState } from 'react';
import { Container, Card, Form, Alert, ButtonGroup } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Image from '../components/atoms/Image';
import { useAuth } from '../context/AuthContext';

const PERFILES = {
  cliente: {
    titulo: 'Cliente',
    texto: 'Inicia sesión para comprar tus productos favoritos.',
  },
  admin: {
    titulo: 'Administrador',
    texto: 'Acceso exclusivo para el personal de la tienda.',
  },
};

function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn, isAdmin } = useAuth();
  const [rol, setRol] = useState('cliente');
  const [form, setForm] = useState({ correo: '', pass: '' });
  const [error, setError] = useState('');

  // Si ya hay sesión, enviar a la página que corresponde a su perfil
  if (isLoggedIn) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const handleRol = (nuevoRol) => {
    setRol(nuevoRol);
    setForm({ correo: '', pass: '' });
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(form.correo.trim().toLowerCase(), form.pass, rol);
    if (!user) {
      setError(`Credenciales incorrectas para el perfil de ${PERFILES[rol].titulo.toLowerCase()}.`);
      return;
    }
    setError('');
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Card style={{ maxWidth: '26rem', width: '100%' }} className="p-4">
        <div className="text-center mb-3">
          <Image src="/imagenes/store-front.png" alt="Logo The Seoul Food" className="logo-nav" />
          <h1 className="h4 mt-2">The Seoul Food</h1>
          <p className="text-muted mb-0">¿Cómo quieres ingresar?</p>
        </div>

        <ButtonGroup className="w-100 mb-3">
          {Object.entries(PERFILES).map(([key, perfil]) => (
            <Button
              key={key}
              variant={rol === key ? 'dark' : 'outline-dark'}
              onClick={() => handleRol(key)}
            >
              {key === 'admin' ? '⚙️ ' : '👤 '}
              {perfil.titulo}
            </Button>
          ))}
        </ButtonGroup>

        <p>{PERFILES[rol].texto}</p>

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
            Ingresar como {PERFILES[rol].titulo.toLowerCase()}
          </Button>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => navigate('/')}
          >
            Continuar sin iniciar sesión
          </Button>
        </Form>

        {rol === 'cliente' && (
          <p className="mt-3 mb-0 text-center">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        )}
      </Card>
    </Container>
  );
}

export default Login;