import { api, getAuth, saveAuth, clearAuth } from './api';

function toSession(data) {
  if (!data?.accessToken || !data.rol) return null;
  return { user: data.email, nombre: data.nombre, rol: data.rol.toLowerCase() };
}

export function getSession() {
  return toSession(getAuth());
}

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password }, { auth: false });
  saveAuth(data);
  return toSession(data);
}

export function register({ nombre, email, password }) {
  return api.post('/auth/register', { nombre, email, password }, { auth: false });
}

export function logout() {
  clearAuth();
}