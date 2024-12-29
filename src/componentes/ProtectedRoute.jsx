import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('idUsuario') !== null;

  console.log('Verificando autenticación...');

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('No autenticado. Redirigiendo al login...');
    return <Navigate to="/login" />;
  }

  // Si está autenticado, permitir acceso al contenido protegido
  return children;
};

export default ProtectedRoute;