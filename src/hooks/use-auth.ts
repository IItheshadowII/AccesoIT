'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1];

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token || !userRole) {
        redirect(`/${currentLang}/login`);
        return;
      }

      // Aquí podrías verificar el token con tu backend si lo necesitas
      // const response = await fetch('/api/auth/verify', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      
      setIsLoading(false);
    };

    verifyAuth();
  }, [currentLang]);

  return { isLoading };
}
