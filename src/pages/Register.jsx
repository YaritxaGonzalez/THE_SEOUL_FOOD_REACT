import { useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import RegisterForm from '../components/organisms/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { isValidName, isValidEmail, isValidPhone, isAdminEmail, ADMIN_DOMAIN } from '../utils/auth';

// El backend nombra los campos distinto que el formulario
const FIELD_MAP = { email: 'correo', password: 'pass', nombre: 'nombre' };

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    pass: '',
    confirmarPass: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!isValidName(form.nombre.trim())) {
      errs.nombre = 'El nombre solo puede contener letras y espacios (mínimo 2 caracteres).';
    }
    if (!isValidEmail(form.correo)) {
      errs.correo = 'Ingresa un correo válido (ej: nombre@correo.com).';
    } else if (isAdminEmail(form.correo)) {
      errs.correo = `Los correos ${ADMIN_DOMAIN} están reservados para el personal de la tienda.`;
    }
    if (!isValidPhone(form.telefono)) {
      errs.telefono = 'Ingresa un teléfono válido (8 a 12 dígitos).';
    }
    if (form.pass.length < 8) {
      errs.pass = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (form.pass !== form.confirmarPass) {
      errs.confirmarPass = 'Las contraseñas no coinciden.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      // El teléfono se valida arriba, pero el backend no lo guarda: no se envía
      await register({
        nombre: form.nombre.trim(),
        email: form.correo.trim().toLowerCase(),
        password: form.pass,
      });
      setErrors({});
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.fields) {
        // Validaciones del backend: un mensaje por campo
        setErrors(
          Object.fromEntries(
            Object.entries(err.fields).map(([campo, msg]) => [FIELD_MAP[campo] ?? campo, msg])
          )
        );
      } else if (err.status === 409) {
        // "El email ya está registrado"
        setErrors({ correo: err.message });
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Card style={{ maxWidth: '26rem', width: '100%' }} className="p-4">
        <Text variant="h1" className="h3">Crear cuenta</Text>
        <Text variant="p">Regístrate para pedir tus productos favoritos.</Text>

        {success && (
          <Alert variant="success">
            ✅ ¡Registro exitoso! Redirigiendo al inicio de sesión...
          </Alert>
        )}
        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <RegisterForm
          form={form}
          errors={errors}
          success={success}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onBackToLogin={() => navigate('/login')}
          onGuest={() => navigate('/')}
        />

        <Text variant="p" className="mt-3 mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </Text>
      </Card>
    </Container>
  );
}

export default Register;