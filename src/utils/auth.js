const USERS_KEY = 'usuariosRegistrados';

// Dominio reservado: solo los administradores pueden usarlo
export const ADMIN_DOMAIN = '@theseoulfood.cl';

// Lista de administradores (puedes agregar más)
const ADMINS = [
  {
    user: 'admin@theseoulfood.cl',
    pass: 'SoulFood2026Adm!',
    rol: 'admin',
    nombre: 'Administrador',
  },
  // {
  //   user: 'otro.admin@theseoulfood.cl',
  //   pass: 'OtraClave2026!',
  //   rol: 'admin',
  //   nombre: 'Otro Admin',
  // },
];

function getRegistered() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function getUsers() {
  return [...ADMINS, ...getRegistered()];
}

export function isAdminEmail(correo) {
  return correo.trim().toLowerCase().endsWith(ADMIN_DOMAIN);
}

export function isValidName(nombre) {
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
  return nombre.length >= 2 && soloLetras.test(nombre);
}

// Correo con formato válido (algo@dominio.ext)
export function isValidEmail(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}

// Teléfono: entre 8 y 12 dígitos (acepta espacios, +, - y paréntesis)
export function isValidPhone(telefono) {
  const digitos = telefono.replace(/[\s+()-]/g, '');
  return /^\d{8,12}$/.test(digitos);
}

export function registerUser({ nombre, correo, telefono, pass }) {
  if (isAdminEmail(correo)) {
    return {
      ok: false,
      error: `Los correos ${ADMIN_DOMAIN} están reservados para el personal de la tienda`,
    };
  }
  if (getUsers().some((u) => u.user === correo)) {
    return { ok: false, error: 'Ya existe una cuenta registrada con ese correo' };
  }
  const registered = getRegistered();
  registered.push({ user: correo, pass, rol: 'cliente', nombre, telefono });
  localStorage.setItem(USERS_KEY, JSON.stringify(registered));
  return { ok: true };
}

// "rol" es el perfil elegido en la pantalla de acceso ('cliente' o 'admin')
export function login(correo, pass, rol) {
  const found = getUsers().find(
    (u) => u.user === correo && u.pass === pass && (!rol || u.rol === rol)
  );
  if (!found) return null;
  sessionStorage.setItem('rolActual', found.rol);
  sessionStorage.setItem('userActual', found.user);
  sessionStorage.setItem('nombreActual', found.nombre || '');
  return found;
}

export function getSession() {
  const user = sessionStorage.getItem('userActual');
  const rol = sessionStorage.getItem('rolActual');
  if (!user || !rol) return null;
  return { user, rol, nombre: sessionStorage.getItem('nombreActual') || '' };
}

export function logout() {
  sessionStorage.removeItem('rolActual');
  sessionStorage.removeItem('userActual');
  sessionStorage.removeItem('nombreActual');
}