// src/app/[lang]/client/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionDetails from '@/components/client/SubscriptionDetails';
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

export default function ClientDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1] as Locale || 'en';
  const [dictionary, setDictionary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'client' && userRole !== 'admin') { // Admin can also view client dashboard for testing
      router.push(`/${currentLang}/login`);
    } else {
      getDictionary(currentLang).then(dict => {
        setDictionary(dict.client.dashboard);
        setIsLoading(false);
      });
    }
  }, [router, currentLang]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push(`/${currentLang}/login`);
  };

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 py-12 md:px-6 md:py-16">
        <User className="h-12 w-12 animate-pulse text-primary" />
        <p className="ml-4 text-xl">Loading Client Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-primary flex items-center">
          <LayoutDashboard className="h-8 w-8 mr-2" />
          {dictionary.title}
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> {dictionary.logoutButton}
        </Button>
      </div>
      <p className="text-muted-foreground mb-8">{dictionary.description}</p>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.subscriptionDetails.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionDetails dictionary={dictionary.subscriptionDetails} currentLang={currentLang} />
        </CardContent>
      </Card>
    </div>
  );
}
