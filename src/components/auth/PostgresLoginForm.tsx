'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';

interface PostgresLoginFormDictionary {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitButton: string;
  loginSuccess: string;
  loginError: string;
  processing: string;
}

interface PostgresLoginFormProps {
  dictionary: PostgresLoginFormDictionary;
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function PostgresLoginForm({ dictionary }: PostgresLoginFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1] as Locale || 'en';

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: dictionary.loginSuccess,
          description: `Welcome ${result.user.email}`,
        });
        localStorage.setItem('token', result.token);
        localStorage.setItem('userRole', result.user.role);
        
        // Asegurar que los datos se guarden antes de redirigir
        localStorage.setItem('token', result.token);
        localStorage.setItem('userRole', result.user.role);
        
        // Redirigir inmediatamente después de guardar los datos
        router.push(`/${currentLang}${result.user.role === 'ADMIN' ? '/admin/dashboard' : ''}`);
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
          placeholder={dictionary.emailPlaceholder}
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
    </form>
  );
}
