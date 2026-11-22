import { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import { isValidEmail, isValidName } from '../../utils/auth';
import Table from '../atoms/Table';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const EMPTY_FORM = { nombre: '', email: '', password: '', rol: 'VENDEDOR' };

function UsersPanel() {
  const { session } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    userService
      .getUsers()
      .then((list) => active && setUsers(list))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const replaceUser = (updated) =>
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!isValidName(form.nombre.trim())) {
      setError('El nombre solo puede contener letras y espacios (mínimo 2 caracteres).');
      return;
    }
    if (!isValidEmail(form.email)) {
      setError('Ingresa un correo válido (ej: nombre@correo.com).');
      return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const created = await userService.createUser({
        ...form,
        nombre: form.nombre.trim(),
        email: form.email.trim().toLowerCase(),
      });
      setUsers((prev) => [...prev, created]);
      setForm(EMPTY_FORM);
      setMessage('Usuario creado');
    } catch (err) {
      setError(err.message); // por ejemplo: "El email ya está registrado"
    } finally {
      setSaving(false);
    }
  };

  const handleRole = async (user, rol) => {
    try {
      replaceUser(await userService.changeRole(user.id, rol));
      setError('');
      setMessage('Rol actualizado');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActive = async (user) => {
    try {
      const updated = await userService.setActive(user.id, !user.activo);
      replaceUser(updated);
      setError('');
      setMessage(updated.activo ? 'Usuario activado' : 'Usuario desactivado');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Text variant="p" className="text-light">Cargando usuarios…</Text>
      ) : (
        <Table responsive hover className="align-middle">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Correo</Table.HeaderCell>
              <Table.HeaderCell>Rol</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {users.map((u) => {
              // El admin no puede quitarse el rol ni desactivar su propia cuenta
              const isSelf = u.email === session?.user;
              return (
                <Table.Row key={u.id}>
                  <Table.Cell>{u.nombre}</Table.Cell>
                  <Table.Cell>{u.email}</Table.Cell>
                  <Table.Cell>
                    <Form.Select
                      size="sm"
                      aria-label={`Rol de ${u.email}`}
                      value={u.rol}
                      disabled={isSelf}
                      title={isSelf ? 'No puedes modificar tu propia cuenta' : undefined}
                      onChange={(e) => handleRole(u, e.target.value)}
                    >
                      {userService.ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </Form.Select>
                  </Table.Cell>
                  <Table.Cell>{u.activo ? 'Activo' : 'Inactivo'}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="sm"
                      variant={u.activo ? 'outline-danger' : 'outline-success'}
                      disabled={isSelf}
                      title={isSelf ? 'No puedes modificar tu propia cuenta' : undefined}
                      onClick={() => handleActive(u)}
                    >
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}

      <Text variant="h2" className="h5 text-light mt-4">Crear usuario</Text>
      <Form onSubmit={handleCreate} noValidate style={{ maxWidth: '28rem' }}>
        <Input className="mb-3" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <Input className="mb-3" type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
        <Input className="mb-3" type="password" name="password" placeholder="Contraseña (mínimo 8 caracteres)" value={form.password} onChange={handleChange} />
        <Form.Select
          className="mb-3"
          name="rol"
          aria-label="Rol del nuevo usuario"
          value={form.rol}
          onChange={handleChange}
        >
          {userService.ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </Form.Select>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Creando…' : 'Crear usuario'}
        </Button>
      </Form>
    </>
  );
}

export default UsersPanel;