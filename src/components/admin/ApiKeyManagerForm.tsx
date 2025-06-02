// src/components/admin/ApiKeyManagerForm.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// Removed Loader2, CheckCircle, AlertTriangle as Firestore key management is removed
// Removed saveGoogleApiKey, getGoogleApiKey imports

interface ApiKeyManagerFormDictionary {
  googleApiKeyLabel: string; // Will be used as section title
  // googleApiKeyPlaceholder: string; // No longer an input field
  firebaseProjectIdLabel: string;
  firebaseProjectIdPlaceholder: string;
  firebaseApiKeyLabel: string;
  firebaseApiKeyPlaceholder: string;
  firebaseAuthDomainLabel: string;
  firebaseAuthDomainPlaceholder: string;
  submitButton: string; // For Firebase config simulation
  successMessage: string; // For Firebase config simulation
  errorMessage: string; // For Firebase config simulation
  // googleKeySuccessSave: string; // Removed
  // googleKeyErrorSave: string; // Removed
  // googleKeyLoading: string; // Removed
  // googleKeyLoaded: string; // Removed
  // googleKeyNotConfigured: string; // Removed
  processing: string; // For Firebase config simulation
  infoText: string; // General info text
  firebaseInfoText: string;
  googleApiKeyInfoText: string; // This will be the primary text for Google API Key
}

interface ApiKeyManagerFormProps {
  dictionary: ApiKeyManagerFormDictionary;
}

// Schema for Firebase reference fields (still simulation)
const firebaseConfigSchema = z.object({
  firebaseProjectId: z.string().optional(),
  firebaseApiKey: z.string().optional(),
  firebaseAuthDomain: z.string().optional(),
});
type FirebaseConfigFormValues = z.infer<typeof firebaseConfigSchema>;

// Google API Key is now managed by environment variables, so no form schema for it here.

export default function ApiKeyManagerForm({ dictionary }: ApiKeyManagerFormProps) {
  const { toast } = useToast();
  // Removed state related to Google API Key loading/saving from Firestore
  
  // Form for Firebase config (simulation) - remains unchanged in functionality
  const {
    register: registerFirebase,
    handleSubmit: handleSubmitFirebase,
    formState: { errors: errorsFirebase },
  } = useForm<FirebaseConfigFormValues>({
    resolver: zodResolver(firebaseConfigSchema),
    defaultValues: {
        firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
        firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
        firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    }
  });

  // Removed useEffect for fetching Google API Key from Firestore
  // Removed onSaveGoogleApiKeySubmit handler

  const onFirebaseSimulatedSubmit: SubmitHandler<FirebaseConfigFormValues> = async (data) => {
    console.log('Simulated Firebase Config Save:', data);
    toast({
      title: 'Simulación (Firebase Config)',
      description: dictionary.successMessage + " (Consola mostrará los datos)",
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      {/* Google API Key Section - Informational Only */}
      <div className="space-y-2 p-4 border rounded-md shadow-sm">
        <h3 className="text-lg font-semibold">{dictionary.googleApiKeyLabel}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.googleApiKeyInfoText}</p>
        {/* Input field for Google API Key removed, as it's managed via .env */}
      </div>

      <hr className="my-6" />

      {/* Firebase Config Section (Simulation) */}
      <form onSubmit={handleSubmitFirebase(onFirebaseSimulatedSubmit)} className="space-y-4 p-4 border rounded-md shadow-sm">
        <h3 className="text-lg font-semibold">Firebase Client Configuration (Reference Only)</h3>
        <p className="text-sm text-muted-foreground">{dictionary.firebaseInfoText}</p>
        <div>
          <Label htmlFor="firebaseProjectId">{dictionary.firebaseProjectIdLabel}</Label>
          <Input
            id="firebaseProjectId"
            type="text"
            placeholder={dictionary.firebaseProjectIdPlaceholder}
            {...registerFirebase('firebaseProjectId')}
            className={`mt-1 ${errorsFirebase.firebaseProjectId ? 'border-destructive' : ''}`}
            readOnly
            defaultValue={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ""}
          />
          {errorsFirebase.firebaseProjectId && <p className="mt-1 text-sm text-destructive">{errorsFirebase.firebaseProjectId.message}</p>}
        </div>
        <div>
          <Label htmlFor="firebaseApiKey">{dictionary.firebaseApiKeyLabel}</Label>
          <Input
            id="firebaseApiKey"
            type="password" // Keep as password for obfuscation
            placeholder={dictionary.firebaseApiKeyPlaceholder}
            {...registerFirebase('firebaseApiKey')}
            className={`mt-1 ${errorsFirebase.firebaseApiKey ? 'border-destructive' : ''}`}
            readOnly
            defaultValue={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '********' : ""}
          />
          {errorsFirebase.firebaseApiKey && <p className="mt-1 text-sm text-destructive">{errorsFirebase.firebaseApiKey.message}</p>}
        </div>
        <div>
          <Label htmlFor="firebaseAuthDomain">{dictionary.firebaseAuthDomainLabel}</Label>
          <Input
            id="firebaseAuthDomain"
            type="text"
            placeholder={dictionary.firebaseAuthDomainPlaceholder}
            {...registerFirebase('firebaseAuthDomain')}
            className={`mt-1 ${errorsFirebase.firebaseAuthDomain ? 'border-destructive' : ''}`}
            readOnly
            defaultValue={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ""}
          />
          {errorsFirebase.firebaseAuthDomain && <p className="mt-1 text-sm text-destructive">{errorsFirebase.firebaseAuthDomain.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={true}>
            {dictionary.submitButton} (Reference Only)
        </Button>
      </form>
    </div>
  );
}
