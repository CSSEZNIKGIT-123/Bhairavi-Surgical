'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  admin: null,
  customerToken: null,
  adminToken: null,
  isCustomerLoggedIn: false,
  isAdminLoggedIn: false,
  loginCustomer: () => {},
  loginAdmin: () => {},
  updateAdmin: () => {},
  updateCustomer: () => {},
  logoutCustomer: () => {},
  logoutAdmin: () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [customerToken, setCustomerToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCust = localStorage.getItem('bhairavi_cust_user');
      const storedCustToken = localStorage.getItem('bhairavi_cust_token');
      if (storedCust && storedCustToken) {
        setUser(JSON.parse(storedCust));
        setCustomerToken(storedCustToken);
      }

      const storedAdmin = localStorage.getItem('bhairavi_admin_user');
      const storedAdminToken = localStorage.getItem('bhairavi_admin_token');
      if (storedAdmin && storedAdminToken) {
        setAdmin(JSON.parse(storedAdmin));
        setAdminToken(storedAdminToken);
      }
    } catch (e) {
      console.error('Error loading auth from local storage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginCustomer = (userData, token) => {
    setUser(userData);
    setCustomerToken(token);
    localStorage.setItem('bhairavi_cust_user', JSON.stringify(userData));
    localStorage.setItem('bhairavi_cust_token', token);
  };

  const updateCustomer = (updatedData, newToken = null) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('bhairavi_cust_user', JSON.stringify(merged));
      return merged;
    });
    if (newToken) {
      setCustomerToken(newToken);
      localStorage.setItem('bhairavi_cust_token', newToken);
    }
  };

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    setAdminToken(token);
    localStorage.setItem('bhairavi_admin_user', JSON.stringify(adminData));
    localStorage.setItem('bhairavi_admin_token', token);
  };

  const updateAdmin = (updatedData, newToken = null) => {
    setAdmin((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('bhairavi_admin_user', JSON.stringify(merged));
      return merged;
    });
    if (newToken) {
      setAdminToken(newToken);
      localStorage.setItem('bhairavi_admin_token', newToken);
    }
  };

  const logoutCustomer = () => {
    setUser(null);
    setCustomerToken(null);
    localStorage.removeItem('bhairavi_cust_user');
    localStorage.removeItem('bhairavi_cust_token');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('bhairavi_admin_user');
    localStorage.removeItem('bhairavi_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        customerToken,
        adminToken,
        isCustomerLoggedIn: !!user,
        isAdminLoggedIn: !!admin,
        loginCustomer,
        loginAdmin,
        updateAdmin,
        updateCustomer,
        logoutCustomer,
        logoutAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
