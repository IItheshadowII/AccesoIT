
import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';

interface FooterDictionary {
  contactInfo: string;
  socialMedia: string;
  legalLinks: string;
  privacyPolicy: string;
  termsOfService: string;
  rightsReserved: string;
  tagline?: string;
  adminLink?: string; // Added admin link
}

interface FooterProps {
  lang: Locale;
  dictionary: FooterDictionary;
  appName: string;
}

export default function Footer({ lang, dictionary, appName }: FooterProps) {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">{appName}</h3>
            <p className="text-sm text-muted-foreground">
              {dictionary.tagline || "Innovative IT Solutions and Automation."}
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">{dictionary.contactInfo}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@accesoit.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">{dictionary.socialMedia}</h4>
            <div className="flex space-x-4">
              <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {appName}. {dictionary.rightsReserved}
            </p>
            <div className="flex space-x-4 text-sm">
              <Link href={`/${lang}/privacy-policy`} className="text-muted-foreground hover:text-primary">
                {dictionary.privacyPolicy}
              </Link>
              <Link href={`/${lang}/terms-of-service`} className="text-muted-foreground hover:text-primary">
                {dictionary.termsOfService}
              </Link>
              {dictionary.adminLink && (
                 <Link href={`/${lang}/admin/products`} className="text-muted-foreground hover:text-primary">
                  {dictionary.adminLink}
                 </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
