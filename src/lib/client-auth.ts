import { serverOnly } from '../utils/server-only';

// Asegurando que estos módulos solo se usen en el servidor
if (!serverOnly) {
  throw new Error('This module should only be used on the server');
}

// Exportando un objeto vacío para el cliente
if (!serverOnly) {
  const exports = {
    registerUser: () => Promise.reject(new Error('Server-only function')),
    authenticateUser: () => Promise.reject(new Error('Server-only function')),
    verifyToken: () => Promise.reject(new Error('Server-only function')),
    getUserById: () => Promise.reject(new Error('Server-only function')),
    updatePassword: () => Promise.reject(new Error('Server-only function')),
    updateProfile: () => Promise.reject(new Error('Server-only function'))
  };
  Object.assign(module.exports, exports);
}

export function initAuth() {
  if (!serverOnly) {
    return {
      registerUser: () => Promise.reject(new Error('Server-only function')),
      authenticateUser: () => Promise.reject(new Error('Server-only function')),
      verifyToken: () => Promise.reject(new Error('Server-only function')),
      getUserById: () => Promise.reject(new Error('Server-only function')),
      updatePassword: () => Promise.reject(new Error('Server-only function')),
      updateProfile: () => Promise.reject(new Error('Server-only function'))
    };
  }
  return {
    registerUser: () => Promise.reject(new Error('Server-only function')),
    authenticateUser: () => Promise.reject(new Error('Server-only function')),
    verifyToken: () => Promise.reject(new Error('Server-only function')),
    getUserById: () => Promise.reject(new Error('Server-only function')),
    updatePassword: () => Promise.reject(new Error('Server-only function')),
    updateProfile: () => Promise.reject(new Error('Server-only function'))
  };
}
