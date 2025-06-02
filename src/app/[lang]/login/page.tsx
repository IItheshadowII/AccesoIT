
// src/app/[lang]/login/page.tsx
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import PostgresLoginForm from '@/components/auth/PostgresLoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function LoginPage({ params }: { params: { lang: Locale } }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 py-12 md:px-6 md:py-16">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary sm:text-4xl">
            {dictionary.login.title}
          </CardTitle>
          <CardDescription>
            {dictionary.login.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostgresLoginForm dictionary={dictionary.login} />
        </CardContent>
      </Card>
    </div>
  );
}
