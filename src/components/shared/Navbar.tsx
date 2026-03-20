'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================================
// Navbar — Top Navigation Bar
// Customize according to your Figma design
// ============================================================

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 backdrop-blur">
      {/* Mobile Menu Toggle */}
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMobileMenuToggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex-1" />

      {/* Add your navbar content from Figma here */}
    </header>
  );
}
