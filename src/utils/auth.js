const USERS_KEY = 'usuariosRegistrados';

const ADMIN = {
  user: 'admin@theseoulfood.cl',
  pass: 'SoulFood2026Adm!',
  rol: 'admin',
};

function getRegistered() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function getUsers() {
  return [ADMIN, ...getRegistered()];
}

export function isValidName(nombre) {
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
  return nombre.length >= 2 && soloLetras.test(nombre);
}

export function registerUser({ nombre, correo, telefono, pass }) {
  if (getUsers().some((u) => u.user === correo)) {
    return { ok: false, error: 'Ya existe una cuenta registrada con ese correo' };
  }
  const registered = getRegistered();
  registered.push({ user: correo, pass, rol: 'cliente', nombre, telefono });
  localStorage.setItem(USERS_KEY, JSON.stringify(registered));
  return { ok: true };
}

export function login(correo, pass) {
  const found = getUsers().find((u) => u.user === correo && u.pass === pass);
  if (!found) return null;
  localStorage.setItem('rolActual', found.rol);
  localStorage.setItem('userActual', found.user);
  return found;
}