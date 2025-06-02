'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

// Define a type for the plan dictionary structure
interface PlanDetail {
  name: string;
  priceMonthly: string;
  priceSuffixMonthly: string;
  priceAnnual: string;
  priceSuffixAnnual: string;
  features: string[];
  popular?: boolean;
}

export interface PlansDictionary {
  title: string;
  monthlyLabel: string;
  annualLabel: string;
  selectPlan: string;
  basic: PlanDetail;
  pro: PlanDetail;
  enterprise: PlanDetail;
}

interface PlansSectionProps {
  dictionary: PlansDictionary;
  lang: Locale;
}

export default function PlansSection({ dictionary, lang }: PlansSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const plansData: PlanDetail[] = [
    dictionary.basic,
    dictionary.pro,
    dictionary.enterprise,
  ];

  const handleSelectPlan = (plan: PlanDetail) => {
    const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
    const billingCycle = isAnnual ? 'annual' : 'monthly';
    router.push(`/${lang}/checkout?planName=${encodeURIComponent(plan.name)}&planPrice=${encodeURIComponent(price)}&billingCycle=${billingCycle}`);
  };

  return (
    <section id="plans" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-6 text-center text-3xl font-bold text-primary sm:text-4xl">
          {dictionary.title}
        </h2>
        <div className="flex items-center justify-center space-x-3 mb-12">
          <Label htmlFor="billing-cycle" className={!isAnnual ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            {dictionary.monthlyLabel}
          </Label>
          <Switch
            id="billing-cycle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            aria-label="Toggle billing cycle"
          />
          <Label htmlFor="billing-cycle" className={isAnnual ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            {dictionary.annualLabel}
          </Label>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plansData.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary border-2 shadow-2xl' : 'hover:shadow-xl transition-shadow duration-300'}`}>
              {plan.popular && (
                <div className="py-1 px-4 bg-primary text-primary-foreground text-sm font-semibold text-center rounded-t-md -mt-px -mx-px">Popular</div>
              )}
              <CardHeader className="items-center text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-4xl font-extrabold text-primary">
                  {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  <span className="text-sm font-normal text-muted-foreground">
                    {isAnnual ? plan.priceSuffixAnnual : plan.priceSuffixMonthly}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {Array.isArray(plan.features) ? plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>{feature}</span>
                    </li>
                  )) : null}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan)} 
                  className="w-full transition-transform hover:scale-105" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {dictionary.selectPlan}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
