import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'ems_auth_user';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

function getStoredUser() {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback((username, password) => {
    const trimmedUsername = username.trim();

    if (
      trimmedUsername === DEFAULT_CREDENTIALS.username &&
      password === DEFAULT_CREDENTIALS.password
    ) {
      const authUser = {
        username: trimmedUsername,
        role: 'Administrator',
      };

      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid username or password.',
    };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
