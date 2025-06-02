
// src/components/checkout/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CheckoutFormDictionary {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  paymentMethodLabel: string;
  mercadoPagoLabel: string;
  cardLabel: string;
  bankTransferLabel: string;
  submitButton: string;
  processingPayment: string;
  paymentSuccessTitle: string;
  paymentSuccessMessage: string;
  paymentPendingTitle: string;
  paymentPendingMessage: string;
  paymentErrorTitle: string;
  paymentErrorMessage: string;
  selectPaymentMethodError: string;
}

interface PaymentInstructionsDictionary {
  bankTransferTitle: string;
  bankTransferAlias: string;
  bankTransferCBU: string;
  bankTransferSteps: string[];
  confirmTransferButton: string;
}

interface CheckoutFormProps {
  dictionary: CheckoutFormDictionary;
  paymentInstructions: PaymentInstructionsDictionary;
}

const checkoutSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  paymentMethod: z.enum(['mercadopago', 'card', 'transfer'], {
    required_error: 'You need to select a payment method.',
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({ dictionary, paymentInstructions }: CheckoutFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error' | 'pending'>('idle');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    setIsLoading(true);
    setPaymentStatus('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (data.paymentMethod === 'transfer') {
      setPaymentStatus('pending');
      toast({
        title: dictionary.paymentPendingTitle,
        description: dictionary.paymentPendingMessage,
      });
    } else {
      // Simulate success/error for MercadoPago/Card
      const isSuccess = Math.random() > 0.2; // 80% chance of success
      if (isSuccess) {
        setPaymentStatus('success');
        toast({
          title: dictionary.paymentSuccessTitle,
          description: dictionary.paymentSuccessMessage,
        });
        reset();
        setSelectedPaymentMethod(undefined); // Reset radio group visual selection
        setValue('paymentMethod', undefined as any); // Reset react-hook-form value
      } else {
        setPaymentStatus('error');
        toast({
          title: dictionary.paymentErrorTitle,
          description: dictionary.paymentErrorMessage,
          variant: 'destructive',
        });
      }
    }
    setIsLoading(false);
  };
  
  const handleBankTransferConfirmation = () => {
    setIsLoading(true);
    setPaymentStatus('idle');
    // Simulate confirmation
    setTimeout(() => {
        setPaymentStatus('pending');
        toast({
            title: dictionary.paymentPendingTitle,
            description: paymentInstructions.bankTransferSteps[2] || dictionary.paymentPendingMessage, // Using specific message from steps
        });
        setIsLoading(false);
    }, 1500);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">{dictionary.nameLabel}</Label>
        <Input
          id="name"
          placeholder={dictionary.namePlaceholder}
          {...register('name')}
          className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">{dictionary.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          placeholder={dictionary.emailPlaceholder}
          {...register('email')}
          className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
        />
        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <Label>{dictionary.paymentMethodLabel}</Label>
        <RadioGroup
          onValueChange={(value) => {
            setSelectedPaymentMethod(value);
            setValue('paymentMethod', value as 'mercadopago' | 'card' | 'transfer', { shouldValidate: true });
            setPaymentStatus('idle'); // Reset payment status when method changes
          }}
          value={selectedPaymentMethod}
          className="mt-2 space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary">
            <RadioGroupItem value="mercadopago" id="mercadopago" />
            <Label htmlFor="mercadopago" className="flex-1 cursor-pointer">{dictionary.mercadoPagoLabel}</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex-1 cursor-pointer">{dictionary.cardLabel}</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary">
            <RadioGroupItem value="transfer" id="transfer" />
            <Label htmlFor="transfer" className="flex-1 cursor-pointer">{dictionary.bankTransferLabel}</Label>
          </div>
        </RadioGroup>
        {errors.paymentMethod && <p className="mt-1 text-sm text-destructive">{errors.paymentMethod.message || dictionary.selectPaymentMethodError}</p>}
      </div>

      {paymentMethod === 'transfer' && paymentStatus !== 'success' && (
        <Alert variant="default" className="border-primary bg-primary/5">
          <Info className="h-4 w-4 !text-primary" />
          <AlertTitle className="text-primary">{paymentInstructions.bankTransferTitle}</AlertTitle>
          <AlertDescription className="space-y-2 text-primary/80">
            <p>{paymentInstructions.bankTransferAlias}</p>
            <p>{paymentInstructions.bankTransferCBU}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{paymentInstructions.bankTransferSteps[0]}</li>
              <li>{paymentInstructions.bankTransferSteps[1]}</li>
            </ul>
             {paymentStatus !== 'pending' && (
                <Button 
                    type="button" 
                    onClick={handleBankTransferConfirmation} 
                    className="mt-4 w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                    variant="outline"
                    disabled={isLoading}
                >
                     {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {paymentInstructions.confirmTransferButton}
                </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {paymentStatus === 'success' && (
        <Alert variant="default" className="border-green-500 bg-green-50 text-green-700">
          <CheckCircle className="h-4 w-4 !text-green-500" />
          <AlertTitle>{dictionary.paymentSuccessTitle}</AlertTitle>
          <AlertDescription>{dictionary.paymentSuccessMessage}</AlertDescription>
        </Alert>
      )}
      {paymentStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{dictionary.paymentErrorTitle}</AlertTitle>
          <AlertDescription>{dictionary.paymentErrorMessage}</AlertDescription>
        </Alert>
      )}
      {paymentStatus === 'pending' && paymentMethod === 'transfer' && (
         <Alert variant="default" className="border-blue-500 bg-blue-50 text-blue-700">
            <Info className="h-4 w-4 !text-blue-500" />
            <AlertTitle>{dictionary.paymentPendingTitle}</AlertTitle>
            <AlertDescription>{paymentInstructions.bankTransferSteps[2] || dictionary.paymentPendingMessage}</AlertDescription>
        </Alert>
      )}


      {paymentMethod !== 'transfer' && paymentStatus !== 'success' && (
        <Button type="submit" className="w-full" disabled={isLoading || !paymentMethod}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {dictionary.processingPayment}
            </>
          ) : (
            dictionary.submitButton
          )}
        </Button>
      )}
       {paymentMethod === 'transfer' && paymentStatus !== 'success' && paymentStatus !== 'pending' && (
        <p className="text-sm text-muted-foreground text-center">
          {/* This button is now inside the transfer alert */}
        </p>
      )}
    </form>
  );
}
