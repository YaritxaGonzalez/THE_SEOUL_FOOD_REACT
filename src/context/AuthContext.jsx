import { createContext, useContext, useState } from 'react';
import { login as loginUser, logout as logoutUser, getSession } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession);

  const login = (correo, pass, rol) => {
    const found = loginUser(correo, pass, rol);
    if (found) setSession(getSession());
    return found;
  };

  const logout = () => {
    logoutUser();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoggedIn: !!session,
        isAdmin: session?.rol === 'admin',
        login,
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