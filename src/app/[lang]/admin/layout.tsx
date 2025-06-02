'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'ADMIN') {
      router.push(`/${currentLang}/login`);
      return;
    }

    // Verificar el token con el backend
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          router.push(`/${currentLang}/login`);
          return;
        }

        const result = await response.json();
        if (result.role !== 'ADMIN') {
          router.push(`/${currentLang}/login`);
          return;
        }

      } catch (error) {
        router.push(`/${currentLang}/login`);
      }
    };

    verifyToken();
  }, [currentLang, router]);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
