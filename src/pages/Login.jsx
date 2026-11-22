import { useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Image from '../components/atoms/Image';
import Text from '../components/atoms/Text';
import LoginForm from '../components/organisms/LoginForm';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn, isAdmin, isSeller } = useAuth();
  const [form, setForm] = useState({ correo: '', pass: '' });
  const [error, setError] = useState('');

  // Si ya hay sesión, enviar a la página que corresponde a su perfil
  // (el admin va a /admin, el cliente a la tienda)
  if (isLoggedIn) {
    const destino = isAdmin ? '/admin' : isSeller ? '/orders' : '/';
    return <Navigate to={destino} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sin rol: el sistema detecta solo si la cuenta es admin o cliente
    const user = login(form.correo.trim().toLowerCase(), form.pass);
    if (!user) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    setError('');
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Card style={{ maxWidth: '26rem', width: '100%' }} className="p-4">
        <Text variant="div" className="text-center mb-3">
          <Image src="/imagenes/store-front.png" alt="Logo The Seoul Food" className="logo-nav" />
          <Text variant="h1" className="h4 mt-2">The Seoul Food</Text>
          <Text variant="p" className="text-muted mb-0">
            Inicia sesión para comprar tus productos favoritos.
          </Text>
        </Text>

        {error && <Alert variant="danger">{error}</Alert>}

        <LoginForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onGuest={() => navigate('/')}
        />

        <Text variant="p" className="mt-3 mb-0 text-center">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </Text>
      </Card>
    </Container>
  );
}

export default Login;