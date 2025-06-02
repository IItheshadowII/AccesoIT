import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types/dictionary';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Bot, CloudCog, Code2, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import PlansSection from '@/components/landing/PlansSection';

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const { lang } = await Promise.resolve(params); // Asegurar que params sea esperado correctamente
  const dictionary = await getDictionary(lang) as Dictionary;

  // fallback seguro si falta la clave services
  const servicesDict = dictionary.services ?? {
    automation: { title: '', description: '' },
    bots: { title: '', description: '' },
    infrastructure: { title: '', description: '' },
    webApps: { title: '', description: '' }
  };

  const services = [
    {
      icon: <Cpu className="h-10 w-10 text-primary mb-4" />,
      title: servicesDict.automation?.title || '',
      description: servicesDict.automation?.description || '',
    },
    {
      icon: <Bot className="h-10 w-10 text-primary mb-4" />,
      title: servicesDict.bots?.title || '',
      description: servicesDict.bots?.description || '',
    },
    {
      icon: <CloudCog className="h-10 w-10 text-primary mb-4" />,
      title: servicesDict.infrastructure?.title || '',
      description: servicesDict.infrastructure?.description || '',
    },
    {
      icon: <Code2 className="h-10 w-10 text-primary mb-4" />,
      title: servicesDict.webApps?.title || '',
      description: servicesDict.webApps?.description || '',
    },
  ];

  // fallback seguro para contact y contact.form
  const contactDict = dictionary.contact ?? { title: '', form: { name: '', namePlaceholder: '', email: '', emailPlaceholder: '', message: '', messagePlaceholder: '', submit: '', success: '', error: '' } };
  const contactFormDict = contactDict.form ?? { name: '', namePlaceholder: '', email: '', emailPlaceholder: '', message: '', messagePlaceholder: '', submit: '', success: '', error: '' };

  // fallback seguro para plans
  const plansDict = dictionary.plans ?? { basic: {}, pro: {}, enterprise: {}, title: '', monthlyLabel: '', annualLabel: '', selectPlan: '' };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              {dictionary.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              {dictionary.hero.subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="transition-transform hover:scale-105">
                <Link href={`/${lang}/advisor`}>{dictionary.hero.cta}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="transition-transform hover:scale-105">
                <Link href={`/${lang}#contact`} className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" /> {dictionary.hero.whatsapp_cta}
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="AI Automation"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint="abstract technology"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary sm:text-4xl">
            {servicesDict.automation?.title || ''}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                {service.icon}
                <CardTitle className="mb-2 text-xl font-semibold">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section - Now uses the new component */}
      <PlansSection dictionary={plansDict as any} lang={lang} />

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary sm:text-4xl">
            {contactDict.title || ''}
          </h2>
          <Card className="max-w-2xl mx-auto p-6 sm:p-8 shadow-lg">
            <ContactForm dictionary={contactFormDict} />
          </Card>
        </div>
      </section>
    </div>
  );
}
