import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiUrl } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userName: string | null;
  userRole: string | null;
  isAdmin: boolean;
  login: (token: string, userName: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('user_name');
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('user_role');
  });

  // Fetch user info if token exists but userName or role is missing
  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUserName = localStorage.getItem('user_name');
      const storedUserRole = localStorage.getItem('user_role');
      
      // Always fetch user info if we have a token (to ensure role is up-to-date)
      if (storedToken) {
        try {
          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const user = await response.json();
            if (user.name) {
              setUserName(user.name);
              localStorage.setItem('user_name', user.name);
            }
            // Always update role from server to ensure it's current
            const role = user.role || 'user';
            setUserRole(role);
            localStorage.setItem('user_role', role);
          } else if (response.status === 401) {
            // Token is invalid, clear everything
            setToken(null);
            setUserName(null);
            setUserRole(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_role');
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const login = (newToken: string, name: string, role: string = 'user') => {
    setToken(newToken);
    setUserName(name);
    setUserRole(role);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_role', role);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    setUserRole(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
  };

  const isAuthenticated = !!token;
  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userName, userRole, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
