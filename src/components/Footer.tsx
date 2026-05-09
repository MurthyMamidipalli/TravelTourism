'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = mounted ? new Date().getFullYear() : '';

  return (
    <footer className="border-t py-8 mt-12 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear || '2024'} TravelSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}
