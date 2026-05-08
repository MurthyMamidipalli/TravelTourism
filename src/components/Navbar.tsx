
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Compass, Globe, MapPin, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Locations', href: '/locations', icon: Globe },
    { name: 'Search', href: '/search', icon: Search },
  ];

  return (
    <nav className={`glass-nav transition-all duration-300 ${scrolled ? 'py-3 shadow-sm' : 'py-5'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter text-zinc-900 dark:text-white">
              Voyage<span className="text-primary">Compass</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
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
              className="rounded-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button className="rounded-full px-6 bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background px-4 py-6 space-y-4 overflow-hidden"
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
            <Button className="w-full rounded-2xl h-14 text-lg">Join Voyage Compass</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
