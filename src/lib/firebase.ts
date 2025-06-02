// src/lib/firebase.ts
// Este archivo es un wrapper que proporciona una interfaz común para el cliente y el servidor
import { initAuth } from './auth';

// Estado de inicialización
let isFirebaseInitialized = true;
let firebaseCriticalError: string | null = null;

// Exportar funciones de autenticación
export const auth = initAuth();

// Exportar una función vacía para el cliente
export const db = null;

export { isFirebaseInitialized, firebaseCriticalError };