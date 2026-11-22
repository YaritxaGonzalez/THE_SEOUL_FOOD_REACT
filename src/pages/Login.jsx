import { useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Image from '../components/atoms/Image';
import Text from '../components/atoms/Text';
import LoginForm from '../components/organisms/LoginForm';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, isAdmin, isSeller } = useAuth();
  const [form, setForm] = useState({ correo: '', pass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, enviar a la página que corresponde a su perfil.
  // El cliente vuelve a donde estaba (por ejemplo, si venía del carrito).
  if (isLoggedIn) {
    const destino = isAdmin ? '/admin' : isSeller ? '/orders' : location.state?.from ?? '/';
    return <Navigate to={destino} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // El rol lo decide el backend según la cuenta
      await login(form.correo.trim().toLowerCase(), form.pass);
      setError('');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
          loading={loading}
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