
'use client';

import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function TermsOfServicePage({ params: { lang } }: { params: { lang: Locale } }) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
    setLastUpdated(new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [lang]);

  if (!dictionary) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary sm:text-4xl">
              Loading...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading content...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary sm:text-4xl">
            {dictionary.footer.termsOfService}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {lastUpdated}</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Agreement to Terms</h2>
          <p>By using our website and services ({`"`}Services{`"`}), you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the Services.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Changes to Terms or Services</h2>
          <p>We may update the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the updated Terms on the Site or through other communications. It’s important that you review the Terms whenever we update them or you use the Services.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Who May Use the Services</h2>
          <p>You may use the Services only if you are 18 years or older and capable of forming a binding contract with {dictionary.appName} and are not barred from using the Services under applicable law.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Use of Services</h2>
          <p>You agree to use the Services only for lawful purposes. You agree not to use the Services in any way that could damage the Services, {dictionary.appName}, or its general business.</p>
          <p>Our AI Automation Advisor provides recommendations based on the information you provide. These recommendations are for informational purposes only and do not constitute professional advice. We are not liable for any decisions made based on these recommendations.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Intellectual Property</h2>
          <p>The Services and their original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of {dictionary.appName} and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of {dictionary.appName}.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Termination</h2>
          <p>We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">7. Limitation of Liability</h2>
          <p>In no event shall {dictionary.appName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">8. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at legal@accesoit.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
