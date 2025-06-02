import { serverOnly } from '../utils/server-only';

// Funciones de autenticación que se ejecutan en el cliente
const auth = {
  registerUser: async (email: string, password: string, role: string = 'client') => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!response.ok) throw new Error('Error al registrar usuario');
    return await response.json();
  },

  authenticateUser: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Error al autenticar');
    return await response.json();
  },

  verifyToken: async (token: string) => {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return await response.json();
  },

  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });
    if (!response.ok) throw new Error('Error al actualizar contraseña');
    return true;
  },

  updateProfile: async (userId: string, data: { email?: string; role?: string }) => {
    const response = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });
    if (!response.ok) throw new Error('Error al actualizar perfil');
    return true;
  },

  getUserById: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Error al obtener usuario');
    return await response.json();
  }
};

// Función principal para exportar el módulo
export function initAuth() {
  return auth;
}
