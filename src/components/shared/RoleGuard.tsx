'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoleCode } from '@/types';

// ============================================================
// RoleGuard — Client-side role-based access control
// Wraps layout content to ensure user has required roles
// ============================================================

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleCode[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  const hasAccess = isAuthenticated && user?.roleCodes?.some((role) => allowedRoles.includes(role));

  // After rehydration the store restores isAuthenticated=true but user=null
  // (user is not persisted). Wait for user to be populated before redirecting.
  const isLoadingUser = _hasHydrated && isAuthenticated && !user;

  useEffect(() => {
    if (!_hasHydrated || isLoadingUser) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!hasAccess) {
      router.replace('/403');
    }
  }, [_hasHydrated, isAuthenticated, hasAccess, isLoadingUser, router]);

  if (!_hasHydrated || isLoadingUser) return null;
  if (!hasAccess) return null;

  return <>{children}</>;
}
