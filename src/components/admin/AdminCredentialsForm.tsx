// src/components/admin/AdminCredentialsForm.tsx
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

interface AdminCredentialsFormDictionary {
  currentPasswordLabel: string;
  currentPasswordPlaceholder: string;
  newUsernameLabel: string;
  newUsernamePlaceholder: string;
  newPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmNewPasswordLabel: string;
  confirmNewPasswordPlaceholder: string;
  submitButton: string;
  successMessage: string;
  errorMessageCurrentPasswordMismatch: string;
  errorMessagePasswordsMismatch: string;
  processing: string;
  infoText: string;
}

interface AdminCredentialsFormProps {
  dictionary: AdminCredentialsFormDictionary;
}

const credentialsSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newUsername: z.string().min(3, { message: 'New username must be at least 3 characters.' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

const DEFAULT_ADMIN_USERNAME = 'admin';

export default function AdminCredentialsForm({ dictionary }: AdminCredentialsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAdminUsername, setCurrentAdminUsername] = useState(DEFAULT_ADMIN_USERNAME);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentAdminUsername(localStorage.getItem('adminUsername') || DEFAULT_ADMIN_USERNAME);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      currentPassword: '',
      newUsername: currentAdminUsername,
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Update default newUsername when currentAdminUsername changes from localStorage
  useEffect(() => {
    reset({ newUsername: currentAdminUsername, currentPassword: '', newPassword: '', confirmNewPassword: '' });
  }, [currentAdminUsername, reset]);


  const onSubmit: SubmitHandler<CredentialsFormValues> = async (data) => {
    setIsLoading(true);

    const storedAdminPassword = localStorage.getItem('adminPassword');

    if (data.currentPassword !== storedAdminPassword) {
      toast({
        title: 'Error',
        description: dictionary.errorMessageCurrentPasswordMismatch,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    localStorage.setItem('adminUsername', data.newUsername);
    localStorage.setItem('adminPassword', data.newPassword);

    toast({
      title: 'Success!',
      description: dictionary.successMessage,
      variant: 'default',
    });
    setCurrentAdminUsername(data.newUsername); // Update state for the form's default
    reset({ // Reset form fields, keeping new username
        currentPassword: '',
        newUsername: data.newUsername, 
        newPassword: '',
        confirmNewPassword: '',
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground">{dictionary.infoText}</p>
      <div>
        <Label htmlFor="currentPassword">{dictionary.currentPasswordLabel}</Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder={dictionary.currentPasswordPlaceholder}
          {...register('currentPassword')}
          className={`mt-1 ${errors.currentPassword ? 'border-destructive' : ''}`}
        />
        {errors.currentPassword && <p className="mt-1 text-sm text-destructive">{errors.currentPassword.message}</p>}
      </div>

      <div>
        <Label htmlFor="newUsername">{dictionary.newUsernameLabel}</Label>
        <Input
          id="newUsername"
          type="text"
          placeholder={dictionary.newUsernamePlaceholder}
          {...register('newUsername')}
          defaultValue={currentAdminUsername}
          className={`mt-1 ${errors.newUsername ? 'border-destructive' : ''}`}
        />
        {errors.newUsername && <p className="mt-1 text-sm text-destructive">{errors.newUsername.message}</p>}
      </div>

      <div>
        <Label htmlFor="newPassword">{dictionary.newPasswordLabel}</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder={dictionary.newPasswordPlaceholder}
          {...register('newPassword')}
          className={`mt-1 ${errors.newPassword ? 'border-destructive' : ''}`}
        />
        {errors.newPassword && <p className="mt-1 text-sm text-destructive">{errors.newPassword.message}</p>}
      </div>

      <div>
        <Label htmlFor="confirmNewPassword">{dictionary.confirmNewPasswordLabel}</Label>
        <Input
          id="confirmNewPassword"
          type="password"
          placeholder={dictionary.confirmNewPasswordPlaceholder}
          {...register('confirmNewPassword')}
          className={`mt-1 ${errors.confirmNewPassword ? 'border-destructive' : ''}`}
        />
        {errors.confirmNewPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmNewPassword.message}</p>}
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
