import { api } from './api';

export const ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'CLIENTE', label: 'Cliente' },
];

// Todo esto es solo para ADMIN
export function getUsers() {
  return api.get('/usuarios');
}

export function createUser({ nombre, email, password, rol }) {
  return api.post('/usuarios', { nombre, email, password, rol });
}

export function changeRole(id, rol) {
  return api.put(`/usuarios/${id}/rol`, { rol });
}

export function setActive(id, activo) {
  return api.put(`/usuarios/${id}/activo?valor=${activo}`);
}