'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

// ============================================================
// Role Redirect Component
// Redirects unauthenticated users to login
// ============================================================

const PUBLIC_ROUTES = ['/login', '/register', '/403'];

export function RoleRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Only run on client-side after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Skip redirect for public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return;
    }

    // Get auth state only after mounted to avoid hydration issues
    const { isAuthenticated } = useAuthStore.getState();

    // Not logged in → redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, pathname, router]);

  return null;
}
