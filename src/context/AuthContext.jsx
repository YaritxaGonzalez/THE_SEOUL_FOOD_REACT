import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { AUTH_CLEARED_EVENT } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(authService.getSession);

  // Si el refresh token vence, api.js borra la sesión y avisa con este evento
  useEffect(() => {
    const onCleared = () => setSession(null);
    window.addEventListener(AUTH_CLEARED_EVENT, onCleared);
    return () => window.removeEventListener(AUTH_CLEARED_EVENT, onCleared);
  }, []);

  // Lanza ApiError si el backend rechaza las credenciales
  const login = async (correo, pass) => {
    const newSession = await authService.login(correo, pass);
    setSession(newSession);
    return newSession;
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoggedIn: !!session,
        isAdmin: session?.rol === 'admin',
        isSeller: session?.rol === 'vendedor',
        login,
        register: authService.register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}