
'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // Only set on client to prevent hydration mismatch
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t py-8 mt-12 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {year || '...'} Voyage Compass. All rights reserved.</p>
      </div>
    </footer>
  );
}
