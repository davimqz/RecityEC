import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Exportar o contexto
export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se há um token salvo no localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Verifica se o token ainda é válido
        validateToken(token);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    }
  };

  const login = (userData, redirectCallback) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Executar callback de redirecionamento se fornecido
    if (redirectCallback && typeof redirectCallback === 'function') {
      redirectCallback();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;