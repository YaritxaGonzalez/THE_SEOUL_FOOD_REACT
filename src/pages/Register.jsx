import { useState } from 'react';
import { Container, Card, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
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
        <h1 className="h3">Crear cuenta</h1>
        <p>Regístrate para pedir tus productos favoritos.</p>

        {success && (
          <Alert variant="success">
            ✅ ¡Registro exitoso! Redirigiendo al inicio de sesión...
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Nombre de usuario"
              value={form.nombre}
              onChange={handleChange}
              isInvalid={!!errors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              isInvalid={!!errors.correo}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.correo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              isInvalid={!!errors.telefono}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="pass"
              placeholder="Contraseña"
              value={form.pass}
              onChange={handleChange}
              isInvalid={!!errors.pass}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.pass}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="confirmarPass"
              placeholder="Confirmar contraseña"
              value={form.confirmarPass}
              onChange={handleChange}
              isInvalid={!!errors.confirmarPass}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.confirmarPass}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mb-2" disabled={success}>
            Registrarse
          </Button>
          {/* Un solo botón de volver (antes estaba repetido) */}
          <Button
            variant="outline-secondary"
            className="w-100 mb-2"
            onClick={() => navigate('/login')}
          >
            Volver al inicio de sesión
          </Button>
          <Button
            variant="link"
            className="w-100"
            onClick={() => navigate('/')}
          >
            Continuar sin registrarme
          </Button>
        </Form>

        <p className="mt-3 mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Register;