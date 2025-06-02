
// src/app/[lang]/checkout/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Loader2 } from 'lucide-react';

// CheckoutPageContent now uses useParams to get 'lang'
function CheckoutPageContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const params = useParams<{ lang?: Locale }>(); // Use the hook, lang might be undefined initially
  const lang = params?.lang;

  const [dictionary, setDictionary] = React.useState<any>(null);
  const planName = searchParams?.planName as string || 'Unknown Plan';
  const planPrice = searchParams?.planPrice as string || 'N/A';
  const billingCycle = searchParams?.billingCycle as string || '';

  React.useEffect(() => {
    if (lang) { // Ensure lang is available before calling getDictionary
        getDictionary(lang).then(setDictionary);
    }
  }, [lang]);

  if (!dictionary || !lang) { // Check for lang and dictionary
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 py-12 md:px-6 md:py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading Checkout Content...</p>
      </div>
    );
  }
  
  const planDetails = {
    name: planName,
    price: planPrice,
    billingCycle: billingCycle === 'annual' ? dictionary.plans.annualLabel : dictionary.plans.monthlyLabel,
    priceSuffix: billingCycle === 'annual' ? dictionary.plans[planName.toLowerCase().replace(/ /g, '')]?.priceSuffixAnnual || dictionary.plans.basic.priceSuffixAnnual : dictionary.plans[planName.toLowerCase().replace(/ /g, '')]?.priceSuffixMonthly || dictionary.plans.basic.priceSuffixMonthly
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary sm:text-4xl">
            {dictionary.checkout.title}
          </CardTitle>
          <CardDescription>{dictionary.checkout.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Card className="bg-secondary/50">
            <CardHeader>
              <CardTitle className="text-xl">{dictionary.checkout.planSelectedTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-semibold text-primary">{planDetails.name}</h3>
              <p className="text-xl text-muted-foreground">
                {planDetails.price}
                <span className="text-sm"> {planDetails.priceSuffix} ({planDetails.billingCycle})</span>
              </p>
            </CardContent>
          </Card>
          <CheckoutForm dictionary={dictionary.checkout.form} paymentInstructions={dictionary.checkout.paymentInstructions} />
        </CardContent>
      </Card>
    </div>
  );
}

// CheckoutPage is the main export for the route.
// It receives `params` and `searchParams` from Next.js routing.
// It doesn't need to pass `params` to CheckoutPageContent if CheckoutPageContent uses `useParams`.
export default function CheckoutPage({ params: routeParams, searchParams }: { params: { lang: Locale }, searchParams: { [key: string]: string | string[] | undefined } }) {
  // routeParams.lang is available here if CheckoutPage needs it directly.
  // For example: console.log('Page lang:', routeParams.lang);

  return (
    <Suspense fallback={
      <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 py-12 md:px-6 md:py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading Checkout Page...</p>
      </div>
    }>
      <CheckoutPageContent searchParams={searchParams} />
    </Suspense>
  );
}
