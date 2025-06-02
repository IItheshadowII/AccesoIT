import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import AutomationAdvisorForm from '@/components/AutomationAdvisorForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdvisorPage({ params }: { params: { lang: Locale } }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary sm:text-4xl">
            {dictionary.advisor.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-8 text-center text-muted-foreground">
            {dictionary.advisor.description}
          </p>
          <AutomationAdvisorForm dictionary={dictionary.advisor} currentLang={lang} />
        </CardContent>
      </Card>
    </div>
  );
}
