
'use client';

import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
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
            {dictionary.footer.privacyPolicy}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {lastUpdated}</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">1. Introduction</h2>
          <p>Welcome to {dictionary.appName}. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@accesoit.com.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following: Name, Email Address, Phone Number, and any other information you choose to provide in contact forms or AI advisor submissions.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. How We Use Your Information</h2>
          <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <ul className="list-disc pl-6">
            <li>To respond to user inquiries/offer support to users.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. How Long Do We Keep Your Information?</h2>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. How Do We Keep Your Information Safe?</h2>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">7. Do We Collect Information From Minors?</h2>
          <p>We do not knowingly solicit data from or market to children under 18 years of age.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">8. What Are Your Privacy Rights?</h2>
          <p>In some regions (like the European Economic Area and the UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">9. Updates To This Policy</h2>
          <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">10. How Can You Contact Us About This Policy?</h2>
          <p>If you have questions or comments about this policy, you may email us at privacy@accesoit.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
