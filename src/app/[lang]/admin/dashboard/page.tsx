// src/app/[lang]/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Cog, ShoppingBag, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1] as Locale || 'en';
  const [dictionary, setDictionary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'ADMIN') {
      router.push(`/${currentLang}/login`);
      return;
    }

    getDictionary(currentLang).then(dict => {
      setDictionary(dict.admin.dashboard);
      setIsLoading(false); 
    });
  }, [router, currentLang]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push(`/${currentLang}/login`);
  };

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 py-12 md:px-6 md:py-16">
        <Cog className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Cog className="h-8 w-8 mr-2" />
          {dictionary.title}
        </h1>
        <Button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            router.push(`/${currentLang}/login`);
          }}
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <p className="text-muted-foreground mb-12">{dictionary.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
              {dictionary.productManagement.title}
            </CardTitle>
            <CardDescription>{dictionary.productManagement.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${currentLang}/admin/products`}>{dictionary.productManagement.link}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
              {dictionary.adminCredentials?.title || "Admin Account"}
            </CardTitle>
            <CardDescription>{dictionary.adminCredentials?.description || "Admin credential management will be updated to use Firebase Authentication features."}</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
              {dictionary.adminCredentials?.infoText || "Admin password changes will be available here once Firebase Auth integration is complete. For now, manage users in the Firebase console."}
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
