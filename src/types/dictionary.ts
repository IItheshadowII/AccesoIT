import type { Locale } from '@/lib/i18n-config';

export type Dictionary = {
  appName: string;
  hero: {
    subtitle: string;
    title: string;
    cta: string;
    whatsapp_cta: string;
  };
  nav: {
    dashboard: string;
    products: string;
    categories: string;
    profile: string;
    logout: string;
    home: string;
    services: string;
    plans: string;
    advisor: string;
    support: string;
    contact: string;
    login: string;
    adminDashboard: string;
    clientDashboard: string;
  };
  services: {
    automation: {
      title: string;
      description: string;
    };
    bots: {
      title: string;
      description: string;
    };
    infrastructure: {
      title: string;
      description: string;
    };
    webApps: {
      title: string;
      description: string;
    };
  };
  plans: {
    title: string;
    description?: string;
    cta?: string;
    monthlyLabel?: string;
    annualLabel?: string;
    selectPlan?: string;
    basic?: any;
    pro?: any;
    enterprise?: any;
  };
  contact: {
    title: string;
    description: string;
    cta: string;
    form?: any;
  };
  products?: any;
  chatWidget?: any;
  footer?: any;
};

export type Dictionaries = {
  [K in Locale]: Dictionary;
};
