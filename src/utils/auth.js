// Dominio reservado para el personal de la tienda
export const ADMIN_DOMAIN = '@theseoulfood.cl';

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