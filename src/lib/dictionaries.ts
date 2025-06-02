import type { Locale } from './i18n-config';

export type Dictionary = {
  login: {
    title: string;
    description: string;
    form: {
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submitButton: string;
      loginSuccess: string;
      loginError: string;
      processing: string;
      adminLoginSuccess: string;
      clientLoginSuccess: string;
      firebaseNotReadyError: string;
      adminEmailPlaceholder: string;
    };
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    login: {
      title: 'Iniciar Sesión',
      description: 'Inicia sesión en tu cuenta',
      form: {
        emailLabel: 'Correo Electrónico',
        emailPlaceholder: 'ejemplo@accesoit.com',
        passwordLabel: 'Contraseña',
        passwordPlaceholder: '••••••••',
        submitButton: 'Iniciar Sesión',
        loginSuccess: 'Inicio de sesión exitoso',
        loginError: 'Error al iniciar sesión',
        processing: 'Procesando...',
        adminLoginSuccess: 'Bienvenido Administrador',
        clientLoginSuccess: 'Bienvenido Cliente',
        firebaseNotReadyError: 'Error de autenticación',
        adminEmailPlaceholder: 'admin@accesoit.com',
      }
    }
  },
  en: {
    login: {
      title: 'Login',
      description: 'Login to your account',
      form: {
        emailLabel: 'Email',
        emailPlaceholder: 'example@accesoit.com',
        passwordLabel: 'Password',
        passwordPlaceholder: '••••••••',
        submitButton: 'Login',
        loginSuccess: 'Login successful',
        loginError: 'Login error',
        processing: 'Processing...',
        adminLoginSuccess: 'Welcome Admin',
        clientLoginSuccess: 'Welcome Client',
        firebaseNotReadyError: 'Authentication error',
        adminEmailPlaceholder: 'admin@accesoit.com',
      }
    }
  }
};

export async function getDictionary(lang: Locale): Promise<Dictionary> {
  return dictionaries[lang];
}
