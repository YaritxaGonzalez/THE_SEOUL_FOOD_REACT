import { useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import RegisterForm from '../components/organisms/RegisterForm';
import { isValidName, isValidEmail, isValidPhone, isAdminEmail, registerUser, ADMIN_DOMAIN } from '../utils/auth';
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    pass: '',
    confirmarPass: '',
  });
  const [errors, setErrors] = useState({});
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
    if (form.pass.length < 6) {
      errs.pass = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (form.pass !== form.confirmarPass) {
      errs.confirmarPass = 'Las contraseñas no coinciden.';
    }
    return errs;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const result = registerUser({
      nombre: form.nombre.trim(),
      correo: form.correo.trim().toLowerCase(),
      telefono: form.telefono.trim(),
      pass: form.pass,
    });

    if (!result.ok) {
      setErrors({ correo: result.error });
      return;
    }

    setErrors({});
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
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

        <RegisterForm
          form={form}
          errors={errors}
          success={success}
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