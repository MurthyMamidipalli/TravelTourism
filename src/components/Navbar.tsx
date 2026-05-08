
'use client';

import Link from 'next/link';
import { Compass, Globe, Users, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Destinations', href: '/destinations', icon: Globe },
    { name: 'Guides', href: '/guides', icon: Users },
    { name: 'Locations', href: '/location', icon: MapPin },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Compass className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">Voyage Compass</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-1.5 text-sm font-medium hover:text-accent transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <Link href="/guides/register">
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Register as Guide
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-base font-medium p-2 hover:bg-secondary rounded-md"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <Link href="/guides/register" onClick={() => setIsOpen(false)} className="block w-full">
            <Button className="w-full bg-primary">Register as Guide</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
