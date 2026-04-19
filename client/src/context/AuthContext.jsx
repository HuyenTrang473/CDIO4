import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || {}; // ❗ FIX: Không throw nữa để tránh crash
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Admin');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (token) {
      setUserName(localStorage.getItem('userName') || 'Admin');
      // Load full profile from localStorage
      const profile = {
        name: localStorage.getItem('userName') || 'Admin',
        email: localStorage.getItem('userEmail') || 'admin@warehouse.vn',
        phone: localStorage.getItem('userPhone') || '0123456789',
        role: localStorage.getItem('userRole') || 'Quản trị viên',
        department: localStorage.getItem('userDepartment') || 'IT',
        avatar: '👤'
      };
      setUserProfile(profile);
    }
  }, [token]);

  const login = (newToken, name, userData = {}) => {
    setToken(newToken);
    setUserName(name);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
    
    // Store additional user data
    const profile = {
      name: name,
      email: userData.email || 'user@warehouse.vn',
      phone: userData.phone || '0123456789',
      role: userData.role || 'Nhân viên',
      department: userData.department || 'Kho hàng',
      avatar: '👤'
    };
    setUserProfile(profile);
    
    // Persist to localStorage
    localStorage.setItem('userEmail', profile.email);
    localStorage.setItem('userPhone', profile.phone);
    localStorage.setItem('userRole', profile.role);
    localStorage.setItem('userDepartment', profile.department);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    setUserProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDepartment');
  };

  const value = {
    token: token || 'mock-jwt-token-123',
    userName,
    userProfile,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
