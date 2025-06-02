// src/components/auth/LoginForm.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';
import { initAuth } from '@/lib/auth';
const auth = initAuth();

// Identificador de correo electrónico del administrador
const ADMIN_EMAIL_IDENTIFIER = 'admin@example.com';

interface LoginFormDictionary {
  emailLabel: string;
  emailPlaceholder: string; // Should be generic like "Email"
  passwordLabel: string;
  passwordPlaceholder: string;
  submitButton: string;
  loginSuccess: string;
  loginError: string;
  processing: string;
  adminLoginSuccess: string;
  clientLoginSuccess: string; // We might not distinguish this way with Firebase Auth initially
  firebaseNotReadyError: string;
  adminEmailPlaceholder: string;
}

interface LoginFormProps {
  dictionary: LoginFormDictionary;
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({ dictionary }: LoginFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1] as Locale || 'en';
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        router.push(`/${currentLang}/admin/dashboard`);
      } else if (userRole === 'client') {
        // For now, client dashboard is still local storage based
        // router.push(`/${currentLang}/client/dashboard`);
      }
    }
  }, [router, currentLang]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      setIsLoading(true);
      const result = await auth.authenticateUser(data.email, data.password);
      if (result) {
        toast({
          title: dictionary.loginSuccess,
          description: result.user.email === ADMIN_EMAIL_IDENTIFIER ? dictionary.adminLoginSuccess : dictionary.clientLoginSuccess,
        });
        localStorage.setItem('token', result.token);
        localStorage.setItem('userRole', result.user.email === ADMIN_EMAIL_IDENTIFIER ? 'admin' : 'client');
        router.push(`/${currentLang}${result.user.role === 'admin' ? '/admin/dashboard' : ''}`);
      } else {
        toast({
          title: dictionary.loginError,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: dictionary.loginError,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="email">{dictionary.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          placeholder={dictionary.adminEmailPlaceholder || "e.g., admin@accesoit.com"}
          {...register('email')}
          className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">{dictionary.passwordLabel}</Label>
        <Input
          id="password"
          type="password"
          placeholder={dictionary.passwordPlaceholder}
          {...register('password')}
          className={`mt-1 ${errors.password ? 'border-destructive' : ''}`}
          autoComplete="current-password"
        />
        {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {dictionary.processing}
          </div>
        ) : (
          dictionary.submitButton
        )}
      </Button>
       <p className="text-xs text-muted-foreground text-center">
        Admin user must be created in Firebase Authentication (e.g., {ADMIN_EMAIL_IDENTIFIER}).
      </p>
    </form>
  );
}
