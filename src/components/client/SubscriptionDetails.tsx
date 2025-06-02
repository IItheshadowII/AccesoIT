// src/components/client/SubscriptionDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CreditCard, CalendarDays, AlertTriangle } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';

interface SubscriptionDetailsDictionary {
  title: string;
  productLabel: string;
  nextPaymentLabel: string;
  paymentDetailsLabel: string;
  expiryDateLabel: string;
  // Mock data directly in component for simplicity, can be moved to dictionary if needed
}

interface SubscriptionDetailsProps {
  dictionary: SubscriptionDetailsDictionary;
  currentLang: Locale;
}

interface MockSubscriptionData {
  productName: string;
  nextPaymentDate: string;
  paymentMethod: string;
  expiryDate: string;
}

export default function SubscriptionDetails({ dictionary, currentLang }: SubscriptionDetailsProps) {
  const [mockData, setMockData] = useState<MockSubscriptionData | null>(null);

  useEffect(() => {
    // Simulate fetching subscription data
    const today = new Date();
    const nextPayment = new Date(today);
    nextPayment.setMonth(today.getMonth() + 1);
    nextPayment.setDate(1);

    const expiry = new Date(today);
    expiry.setFullYear(today.getFullYear() + 1);

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    setMockData({
      productName: currentLang === 'es' ? 'Plan Bot Pro' : 'Pro Bot Plan',
      nextPaymentDate: nextPayment.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options),
      paymentMethod: currentLang === 'es' ? 'Visa terminada en **** 1234' : 'Visa ending in **** 1234',
      expiryDate: expiry.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options),
    });
  }, [currentLang]);

  if (!mockData) {
    return <p>Loading subscription details...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.productLabel}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.productName}</div>
            <p className="text-xs text-muted-foreground">
              {currentLang === 'es' ? 'Su plan actual activo.' : 'Your currently active plan.'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.nextPaymentLabel}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.nextPaymentDate}</div>
            <p className="text-xs text-muted-foreground">
             {currentLang === 'es' ? 'Próxima fecha de facturación programada.' : 'Next scheduled billing date.'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.paymentDetailsLabel}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{mockData.paymentMethod}</div>
            <p className="text-xs text-muted-foreground">
              {currentLang === 'es' ? 'Método de pago registrado.' : 'Registered payment method.'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.expiryDateLabel}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{mockData.expiryDate}</div>
            <p className="text-xs text-muted-foreground">
              {currentLang === 'es' ? 'Fecha de vencimiento de la suscripción.' : 'Subscription expiration date.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
