// src/components/layout/Header.tsx
'use client'; 

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import type { Locale } from '@/lib/i18n-config';
import { ThemeToggle } from './ThemeToggle';
import { LogIn, LogOut, LayoutDashboard, UserCircle, TerminalSquare } from 'lucide-react';
async function verifyToken(token: string) {
  const response = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return await response.json();
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"


interface NavDictionary {
  home: string;
  services: string;
  plans: string;
  advisor: string;
  contact: string;
  login: string;
  dashboard: string; 
  logout: string;    
  adminDashboard: string; 
  clientDashboard: string; 
}

interface HeaderProps {
  lang: Locale;
  dictionary: NavDictionary;
  appName: string;
}

const AccesoItLogoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 74 74"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="AccesoIT Logo"
  >
    <defs>
      <linearGradient id="logoIconGradientHeader" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(var(--primary))" /> 
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    <path
      d="M56 12H31C19.402 12 10 21.402 10 33V41C10 52.598 19.402 62 31 62H44"
      stroke="url(#logoIconGradientHeader)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="23" r="9" fill="url(#logoIconGradientHeader)" />
    <circle cx="28" cy="51" r="9" fill="url(#logoIconGradientHeader)" />
    <line
      x1="50"
      y1="23"
      x2="28"
      y2="51"
      stroke="url(#logoIconGradientHeader)"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);


export default function Header({ lang, dictionary, appName }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<{ userId: number; role: string; email: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // Still using this for quick UI updates
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token).then((decoded) => {
        if (decoded) {
          setCurrentUser(decoded);
          setUserRole(decoded.role);
        }
      }).catch((error) => {
        console.error(error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setCurrentUser(null);
        setUserRole(null);
      });
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
    setUserRole(null);
    router.push(`/${lang}/login`);
    router.refresh();
  };

  const navLinks = [
    { href: `/${lang}`, label: dictionary.home },
    { href: `/${lang}#services`, label: dictionary.services },
    { href: `/${lang}#plans`, label: dictionary.plans },
    { href: `/${lang}/advisor`, label: dictionary.advisor },
  ];

  const getDashboardLink = () => {
    if (userRole === 'admin') return `/${lang}/admin/dashboard`;
    if (userRole === 'client') return `/${lang}/client/dashboard`;
    return `/${lang}/login`;
  };
  
  const getDashboardLabel = () => {
    if (userRole === 'admin') return dictionary.adminDashboard || "Admin Panel";
    if (userRole === 'client') return dictionary.clientDashboard || "My Account";
    return dictionary.login;
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <AccesoItLogoIcon />
          <span className="text-xl font-bold text-primary">{appName}</span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {currentUser || userRole ? ( // Check currentUser from Firebase or fallback userRole
            <>
              <Link
                href={getDashboardLink()}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LayoutDashboard className="inline h-4 w-4 mr-1"/> {getDashboardLabel()}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <LogOut className="h-4 w-4 mr-1" />{dictionary.logout}
              </Button>
            </>
          ) : (
            <Link
              href={`/${lang}/login`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LogIn className="inline h-4 w-4 mr-1"/> {dictionary.login}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <Link href={`/${lang}#contact`}>{dictionary.contact}</Link>
          </Button>
          <LanguageSwitcher currentLocale={lang} />
          <ThemeToggle />
          <div className="md:hidden"> {/* Mobile Menu / Login Button */}
            {currentUser || userRole ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <UserCircle className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={getDashboardLink()} className="flex items-center w-full">
                                <LayoutDashboard className="h-4 w-4 mr-2" /> {getDashboardLabel()}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full cursor-pointer">
                            <LogOut className="h-4 w-4 mr-2" /> {dictionary.logout}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
               <Button asChild variant="outline" size="icon" className="md:hidden">
                <Link href={`/${lang}/login`}>
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">{dictionary.login}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
