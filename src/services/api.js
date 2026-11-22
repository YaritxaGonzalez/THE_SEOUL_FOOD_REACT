import { API_URL } from './config';

const AUTH_KEY = 'seoulfood_auth';

export function getAuth() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}
export function saveAuth(data) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
}
export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

// El backend responde { error: "mensaje" } o { campo: "mensaje" } (validaciones)
function toApiError(status, body) {
  if (body?.error) return new ApiError(status, body.error);
  if (body && typeof body === 'object') {
    return new ApiError(status, Object.values(body).join(' '), body);
  }
  return new ApiError(status, 'Error inesperado del servidor');
}

async function readBody(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// Access token vencido: se pide uno nuevo con el refresh token
async function refresh(session) {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    if (!res.ok) {
      clearAuth();
      return false;
    }
    saveAuth(await res.json());
    return true;
  } catch {
    return false;
  }
}

async function send(path, { method = 'GET', body, auth = true } = {}, canRetry = true) {
  const headers = {};
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  const session = getAuth();
  if (auth && session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor');
  }

  if (res.status === 401 && auth && canRetry && session?.refreshToken) {
    if (await refresh(session)) return send(path, { method, body, auth }, false);
  }

  const data = await readBody(res);
  if (!res.ok) throw toApiError(res.status, data);
  return data;
}

export const api = {
  get: (path, opts) => send(path, { ...opts }),
  post: (path, body, opts) => send(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => send(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => send(path, { ...opts, method: 'DELETE' }),
};