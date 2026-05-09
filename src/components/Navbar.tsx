
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Compass, Globe, Search, Menu, X, Sun, Moon, LogOut, User as UserIcon, Utensils, ShieldCheck, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, mounted]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Locations', href: '/locations', icon: Globe },
    { name: 'Restaurants', href: '/restaurants', icon: Utensils },
    { name: 'Emergency', href: '/emergency', icon: LifeBuoy },
    { name: 'Search', href: '/search', icon: Search },
  ];

  if (!mounted) {
    return (
      <nav className="h-20 bg-white dark:bg-black border-b flex items-center shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter">
                Voyage<span className="text-primary">Compass</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`h-20 flex items-center sticky top-0 z-50 border-b transition-all duration-300 shrink-0 ${
      scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm' : 'bg-white dark:bg-black'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter text-zinc-900 dark:text-white">
              Voyage<span className="text-primary">Compass</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-border mx-2" />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full h-10 w-10 shrink-0"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 shrink-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {(user.displayName || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Compass className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/guides/register" className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Become a Guide</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full px-6 font-semibold h-10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-10">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 h-10 w-10 flex items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background px-4 py-6 space-y-4 absolute top-20 left-0 right-0 z-50 shadow-2xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-bold p-3 hover:bg-secondary rounded-2xl transition-colors"
              >
                <item.icon className="w-6 h-6 text-primary" />
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{(user.displayName || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start rounded-2xl h-12">
                    <Compass className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start rounded-2xl h-12">
                    <UserIcon className="mr-2 h-4 w-4" /> My Profile
                  </Button>
                </Link>
                <Button variant="outline" className="w-full rounded-2xl h-12 text-destructive mt-2" onClick={handleSignOut}>
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-2xl h-14 text-lg">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-2xl h-14 text-lg">Join Voyage Compass</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
